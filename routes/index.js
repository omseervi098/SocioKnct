const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");
const passportLocal = require("../config/passport-local-strategy");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/api", require("./api"));
router.use("/likes", require("./likes"));
router.use("/messages", require("./messages"));
router.use("/friends", require("./friends"));
router.use("/polls", require("./polls"));
router.get(
  "/autocomplete",
  passportLocal.checkAuthenication,
  homeController.autoComplete
);
router.post(
  "/remove",
  passportLocal.checkAuthenication,
  homeController.removeFriend
);
router.get(
  "/search/:query",
  passportLocal.checkAuthenication,
  homeController.search
);
router.post(
  "/add-friend",
  passportLocal.checkAuthenication,
  homeController.acceptFriend
);

//For any further routes, acces from here:
//router.use('/routerName',require('./routerFile'));

module.exports = router;
