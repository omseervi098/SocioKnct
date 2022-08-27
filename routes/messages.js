const express = require('express');
const router = express.Router();
const passportLocal=require('../config/passport-local-strategy');
const passport = require('passport');
const messagesController = require('../controllers/messages_controller');
//Check if user is authenticated
router.get('/chats',passportLocal.checkAuthenication, messagesController.userChats);
router.get('/chatroom',passportLocal.checkAuthenication,messagesController.chatRoom);

module.exports = router;