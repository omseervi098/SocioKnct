const express=require('express');;
const router=express.Router();
const passport=require('passport');
const passportLocal=require('../config/passport-local-strategy');
const userController=require('../controllers/users_controller');
router.get('/profile/:id',passportLocal.checkAuthenication,userController.profile);
router.get('/login',userController.login);
router.get('/signup',userController.signUp);
router.post('/create',userController.create);
router.get('/signout',userController.destroySession);
//Use passport as middleware
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'},
),userController.createSession)
module.exports=router;