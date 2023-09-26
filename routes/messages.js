const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages_controller");
const passportLocal = require("../config/passport-local-strategy");

router.get(
  "/chatroom",
  passportLocal.checkAuthenication,
  messagesController.chatRoom
);
router.get(
  "/",
  passportLocal.checkAuthenication,
  messagesController.getMessenging
);
module.exports = router;
