const User = require("../models/user");
const forgotPass = require("../models/forgotpass");
const fs = require("fs");
const path = require("path");
const forgotpassMailer = require("../mailers/forgotpass_mailer");
const crypto = require("crypto");
const Friend = require("../models/friend");
const Post=require("../models/post");
const Comment = require("../models/comment");
const Like=require("../models/like");
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    //Find whether the user is friend or not
    let curruser = await User.findById(req.user.id).populate({
      path: "friendsList",
      populate: { path: "friendId" },
    });
    console.log(curruser.friendsList);
    let isFriend = false;
    // console.log(friend);
    //Find all post of the user
    let posts = await Post.find({ user: req.params.id }).populate("user").populate({
      path: "comments",
      populate: { path: "content user" },

    });
    //Find all comments of the user

    
    if(curruser.friendsList.length > 0){
      curruser.friendsList.forEach(friend => {
        if(friend.friendId.id == user.id){
          isFriend = true;
        }
      }
      );
    }
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
      isFriend: isFriend,
      newfriend: req.user.request,
      posts: posts,
    });
  } catch (err) {
    console.log("Error in finding user in profile");
    return;
  }
};
module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findByIdAndUpdate(req.params.id);
      //Accessing static function of the model

      User.uploadedAvatar(req, res, (err) => {
        if (err) {
          console.log("Error in uploading avatar");
          return;
        }
        user.name = req.body.name;
        //Check if email exists in the database
        if(user.email!=req.body.email){
        let checkemail= User.findOne({ email: req.body.email })
        if(checkemail){
          req.flash("error", "Email already exists");
          return res.redirect("back");
        } 
        user.email = req.body.email;
       }
        //Check if username matches with current user username
        if (user.username != req.body.username) {
        let check= User.findOne({ username: req.body.username })
        if(check){
          req.flash("error", "Username already exists");
          return res.redirect("back");
        }
        user.username=req.body.username;
        }
        if (req.file) {
          if (user.avatar) {
            if (
              fs.existsSync(path.join(__dirname, "..", "public", user.avatar))
            ) {
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
          }
          //If there is an avatar it will save file name in the database
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      console.log(err);
      console.log("Error in updating user");
      return;
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
};
module.exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("../views/user_login");
};
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("../views/user_signup");
};
//Get signup data
module.exports.create = function (req, res) {
  //check ipassword strength
  if (req.body.password.length < 8) {
    req.flash("error", "Password should be atleast 6 characters long");
    return res.redirect("back");
  }
  //Check if password contains digits and characters and special characters
  if (!req.body.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)) {
    req.flash("error", "Password should contain atleast one digit and one special character");
    return res.redirect("back");
  }

  if (req.body.password != req.body.confirm_password) {
    req.flash('error', 'Passwords do not match');
    return res.redirect("back");
  }
  //
  //takeout username from mail
  let username="";
  for(let i=0;i<req.body.email.length;i++){
    if(req.body.email[i]=="@"){
      break;
    }
    username+=req.body.email[i];
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("Error in finding user in signing up");
      return;
    }
    if (!user) {
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          username: username,
        },
        (err, user) => {
          if (err) {
            console.log("Error in creating user while signing up");
            return;
          }
          return res.redirect("/users/login");
        }
      );
    } else {
      return res.redirect("back");
    }
  });
};
//Get login data
module.exports.createSession = function (req, res) {
  //console.log(req);
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};
//Sign Out
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
};
module.exports.forgotPassword = (req, res) => {
  return res.render("../views/forgot_password");
};
module.exports.createAccessToken = async (req, res) => {
  //Creating access token and sending mail to user
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    if (user) {
      //If User is found then create random token using crypto library and store it in the database
      let token = crypto.randomBytes(20).toString("hex");
      let forgotpass = await forgotPass.create({
        user: user.id,
        accessToken: token,
        isUsed: false,
      });

      forgotpass = await forgotpass.populate("user", "email name");
      //Send mail to user with token
      forgotpassMailer.newpass(forgotpass);
      req.flash("success", "Mail sent successfully");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.resetPassword = async (req, res) => {
  //Check if token is valid or not
  try {
    let forgotpass = await forgotPass.findOne({
      accessToken: req.query.accessToken,
      isUsed: false,
    });
    if (!forgotpass) {
      req.flash("error", "Invalid token");
      return res.redirect("back");
    }
    forgotpass = await forgotpass.populate("user", "email name");

    return res.render("../views/reset_password", {
      accessToken: req.query.accessToken,
      email: forgotpass.user.email,
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
module.exports.updatePassword = async (req, res) => {
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password doesn't match");
      return res.redirect("back");
    }

    let forgotpass = await forgotPass.findOne({
      accessToken: req.query.accessToken,
      isUsed: false,
    });
    //console.log(forgotpass);
    if (!forgotpass) {
      req.flash("error", "Invalid token");
      return res.redirect("back");
    }
    //If token is valid then update password
    User.findByIdAndUpdate(
      forgotpass.user,
      { password: req.body.password },
      (err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        //If password is updated then update isUsed field in the database
        forgotPass.findByIdAndUpdate(
          forgotpass.id,
          { isUsed: true },
          (err, forgotpass) => {
            if (err) {
              console.log(err);
              return;
            }
            req.flash("success", "Password updated successfully");
            return res.redirect("/users/login");
          }
        );
      }
    );
  } catch (err) {
    console.log("error in updating password", err);
    return;
  }
};
