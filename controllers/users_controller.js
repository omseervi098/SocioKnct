const User = require("../models/user");
module.exports.profile = function (req, res) {
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, (err, user) => {
      if (err) {
        console.log("Error in finding user in profile");
        return;
      }
      if (user) {
        return res.render("../views/user_profile", { user: user });
      }
      return res.redirect("/users/login");
    });
  } else {
    res.redirect("/users/login");
  }
};
module.exports.login = function (req, res) {
  //Handling case when user is already logged in
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, (err, user) => {
      if (err) {
        console.log("Error in finding user in creating session");
        return;
      }
      if (user) {
        return res.redirect("/users/profile");
      }
    });
  } else {
    return res.render("../views/user_login");
  }
};
module.exports.signUp = function (req, res) {
  //Handling case when user is already logged in
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, (err, user) => {
      if (err) {
        console.log("Error in finding user in creating session");
        return;
      }
      if (user) {
        return res.redirect("/users/profile");
      }
    });
  } else {
    return res.render("../views/user_signup");
  }
};
//Get signup data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  } else {
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
  }
};
//Get login data
module.exports.createSession = function (req, res) {
  //Steps To Create Sessions
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("Error in finding user in logging in");
      return;
    }
    //handle if user found
    if (user) {
      //Handle password mismatch
      if (user.password != req.body.password) {
        return res.redirect("back");
      }
      res.cookie("user_id", user.id);
      return res.redirect("/users/profile");
      //handle session creation
    } else {
      //handle if user not found
      return res.redirect("back");
    }
  });
};
//Logout
module.exports.logout = function (req, res) {
  res.clearCookie("user_id");
  return res.redirect("/users/login");
};
