const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Protected routes (admin only)
router.post('/', authenticateToken, upload.single('image'), projectController.createProject);
router.put('/:id', authenticateToken, upload.single('image'), projectController.updateProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);
router.patch('/:id/toggle-featured', authenticateToken, projectController.toggleFeatured);
//router.patch('/reorder', authenticateToken, projectController.reorderProjects);

module.exports = router;