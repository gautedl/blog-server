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
router.post('/comment/:id/create_comment', comment_controller.comment_create);
router.post('/comment/:id/like', comment_controller.comment_like);
router.post('/comment/:id/delete', comment_controller.comment_delete);
router.get('/comment/:id/get_likes', comment_controller.get_likes_comment);
router.post('/comment/:id/delete_all', comment_controller.delete_all_comments);
router.post('/comment/:id/post_delete', comment_controller.delete_comment_post);

/// USER ROUTES ///
router.get('/users', user_controller.get_all_users);
router.post('/admin/sign_up', user_controller.sign_up);
router.post('/admin/log_in', user_controller.log_in);
router.post('/admin/log_out', user_controller.log_out);
router.post('/admin/user/:id/admin', user_controller.get_admin);
router.get('/admin/isloggedin', user_controller.is_logged_in);

module.exports = router;
