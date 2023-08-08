const express = require("express");
const router = express.Router();
const passport = require("passport");

const commentsController = require("../controllers/comments_controller");

router.post("/create", passport.checkAuthenication, commentsController.create);
router.post(
  "/create-reply",
  passport.checkAuthenication,
  commentsController.createReply
);
router.get(
  "/destroy/:id",
  passport.checkAuthenication,
  commentsController.destroy
);
router.get(
  "/destroy-reply/:id",
  passport.checkAuthenication,
  commentsController.destroyReply
);
module.exports = router;
