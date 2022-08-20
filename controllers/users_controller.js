const User = require("../models/user");
const fs=require("fs");
const path=require("path");
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
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

      User.uploadedAvatar(req,res,(err)=>{
        if(err){
          console.log("Error in uploading avatar");
          return;
        }
        user.name=req.body.name;
        user.email=req.body.email;
        if(req.file){
            if(user.avatar){
              if(fs.existsSync(path.join(__dirname,"..","public",user.avatar))){
                fs.unlinkSync(path.join(__dirname,"..",user.avatar));
              }
            }
            //If there is an avatar it will save file name in the database
            user.avatar=User.avatarPath+"/"+req.file.filename;
        }
        user.save();
        return res.redirect("back");
      })
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
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("Error in finding user in signing up");
      return;
    }
    if (!user) {
      User.create(req.body, (err, user) => {
        if (err) {
          console.log("Error in creating user while signing up");
          return;
        }
        return res.redirect("/users/login");
      });
    } else {
      return res.redirect("back");
    }
  });
};
//Get login data
module.exports.createSession = function (req, res) {
  console.log(req);
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
