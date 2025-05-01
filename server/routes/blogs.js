// server/routes/blogs.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);

// Protected routes (admin only)
router.get('/admin', authenticateToken, blogController.getAllBlogsAdmin);

// Add upload middleware to handle file uploads
router.post('/', authenticateToken, upload.single('coverImage'), blogController.createBlog);
router.put('/:id', authenticateToken, upload.single('coverImage'), blogController.updateBlog);
router.delete('/:id', authenticateToken, blogController.deleteBlog);

module.exports = router;