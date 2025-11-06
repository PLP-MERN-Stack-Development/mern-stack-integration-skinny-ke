const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const postsController = require('../controllers/postsController');

router.get('/', postsController.getPosts);
router.get('/search', postsController.searchPosts);
router.get('/:id', postsController.getPostById);
router.post('/', protect, upload.single('featuredImage'), [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('category').notEmpty(),
], postsController.createPost);

router.put('/:id', protect, upload.single('featuredImage'), postsController.updatePost);
router.delete('/:id', protect, postsController.deletePost);

router.post('/:id/comments', protect, [
  body('content').notEmpty(),
], postsController.addComment);

module.exports = router;
