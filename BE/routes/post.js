const express = require('express')
const router  = express.Router();
const auth = require('../middleware/auth');
const PostController =  require('../controllers/post')

router.get('/allpost',auth,PostController.allpost)

router.post('/createpost',auth,PostController.create_post)

router.get('/mypost',auth,PostController.my_post)

router.put('/like',auth,PostController.like)

router.put('/unlike',auth,PostController.unlike)

router.put('/comment',auth,PostController.comment)

router.delete('/deletepost/:postId',auth,PostController.delete_post)

router.get('/subscriptionpost',auth,PostController.subscription_post)



module.exports = router;