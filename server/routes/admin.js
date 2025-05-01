// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Stats endpoint for the admin dashboard
router.get('/stats', authenticateToken, adminController.getDashboardStats);

module.exports = router;