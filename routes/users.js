const express=require('express');;
const router=express.Router();
const passport=require('passport');
const passportLocal=require('../config/passport-local-strategy');
const userController=require('../controllers/users_controller');
router.get('/profile/:id',passportLocal.checkAuthenication,userController.profile);
router.post('/update/:id',passportLocal.checkAuthenication,userController.update);
router.get('/login',userController.login);
router.get('/signup',userController.signUp);
router.post('/create',userController.create);
router.get('/signout',userController.destroySession);
router.get('/forgot-password',userController.forgotPassword);
router.post('/forgot-password/create-access-token',userController.createAccessToken);
router.get('/forgot-password/reset-password/',userController.resetPassword);
router.post('/reset-pass',userController.updatePassword);
//Use passport as middleware
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'},
),userController.createSession)

router.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/login'}), userController.createSession);
module.exports=router;