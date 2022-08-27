const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');


router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/api',require('./api'));
router.use('/likes',require('./likes'));
router.get('/autocomplete',homeController.autoComplete);
router.post('/remove',homeController.removeFriend)
router.get('/search/:query',homeController.search);
router.post('/add-friend',homeController.acceptFriend);

//For any further routes, acces from here:
//router.use('/routerName',require('./routerFile'));

module.exports=router;