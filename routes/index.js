const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');

router.get('/',homeController.home);
router.use('/users',require('./users'));
//login
router.get('/login',homeController.login);
//Signup
router.get('/signup',homeController.signup);
//For any further routes, acces from here:
//router.use('/routerName',require('./routerFile'));

module.exports=router;