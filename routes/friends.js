const express=require('express');
const router=express.Router();
const friendsController=require('../controllers/friends_controller');
router.get('/',friendsController.friends);
module.exports=router;