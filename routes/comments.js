const express=require('express');
const router=express.Router();
const passport=require('passport');
const commentController=require('../controllers/comments_controller');
router.post('/create',passport.checkAuthenication,commentController.create);
module.exports=router;