const express=require('express');
const router=express.Router();
const messagesController=require('../controllers/messages_controller');
const passportLocal=require('../config/passport-local-strategy')
router.get('/chats',passportLocal.checkAuthenication,messagesController.userChats);
router.get('/chatroom',passportLocal.checkAuthenication,messagesController.chatRoom);
module.exports=router;