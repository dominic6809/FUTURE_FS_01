// server/routes/contact.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');

// Public route
router.post('/', contactController.submitContactForm);

// Protected routes (admin only)
router.get('/', authenticateToken, contactController.getAllContacts);
router.patch('/:id', authenticateToken, contactController.updateContactStatus);
router.delete('/:id', authenticateToken, contactController.deleteContact);

module.exports = router;