const express = require('express');
const router = express.Router();

const comment_controller = require('../controllers/commentController');
const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');

/// POST ROUTES ///
// Get all posted posts
router.get('/posts', post_controller.posted_posts);
router.get('/post/:id', post_controller.post_detail);
// router.get('/post/create', post_controller.create_post);
router.get('/posts/unposted', post_controller.unposted_posts);
// router.get("/post/unposted/:id", post_controller.post_detail);
router.get('/post/:id/get_likes', post_controller.get_likes_post);

router.post('/admin/post/create', post_controller.create_post);
router.post('/admin/post/:id/upload', post_controller.post_post);
router.post('/admin/post/:id/edit', post_controller.edit_post);
router.post('/admin/post/:id/delete', post_controller.post_delete);
router.post('/post/:id/like', post_controller.post_like);

/// COMMENT ROUTES ///
router.post('/post/:id/create_comment', comment_controller.comment_create);
router.post('/post/:id/:comment_id/like', comment_controller.comment_like);
router.post('/post/:id/:comment_id/delete', comment_controller.comment_like);

/// USER ROUTES ///
router.post('/admin/sign_up', user_controller.sign_up);
router.post('/admin/log_in', user_controller.log_in);
router.post('/admin/log_out/:id', user_controller.log_out);
router.post('/admin/user/:id/admin', user_controller.get_admin);

module.exports = router;
