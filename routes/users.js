const express=require('express');
const router=express.Router();
const userController=require('../controllers/users_controller');
router.get('/profile',userController.profile);
router.get('/login',userController.login);
router.get('/signup',userController.signUp);
router.post('/create',userController.create);

module.exports=router;