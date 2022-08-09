const express=require('express');
const router=express.Router();
const passport=require('passport');

const userController=require('../controllers/users_controller');
router.get('/profile',userController.profile);
router.get('/login',userController.login);
router.get('/signup',userController.signUp);
router.post('/create',userController.create);
//Use passport as middleware
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'},
),userController.createSession)
module.exports=router;