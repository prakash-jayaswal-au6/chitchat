const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../middleware/auth');

const dotenv = require('dotenv');
dotenv.config();


router.post('/register',UserController.register_user);

router.get("/confirmation/:token",UserController.confirmation);

router.post('/login',UserController.login_user);

router.post('/reset-password',UserController.reset_password)

router.post('/new-password',UserController.new_password)

//get self profile
router.get('/profile',auth,UserController.profile)

router.put('/updatepic',auth, UserController.update_profile_pic)

//get another user profile
router.get('/user/:id',auth,UserController.get_a_user_profile)

router.put('/changepassword',auth,UserController.change_password)




//follow user
router.put('/follow',auth,UserController.follow_user)
//unfollow user
router.put('/unfollow',auth,UserController.unfollow_user)

router.post('/search-users',auth,UserController.search_user)


router.get("/getChat/:id",auth,UserController.chat_user)

router.get("/recomendation",auth,UserController.recomendation)


module.exports = router;