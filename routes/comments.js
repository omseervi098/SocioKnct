const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

router.post('/create',passport.checkAuthenication,commentsController.create);
router.get('/destroy/:id',passport.checkAuthenication, commentsController.destroy);
module.exports = router;