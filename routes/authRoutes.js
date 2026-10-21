const express = require('express');
const authController = require('../controllers/authController.js'); // Ensure correct import of the controller methods
const authenticate = require('../middleware/authMiddleware.js');
const router = express.Router();

// POST route for user registration
router.post('/register', authController.register);

// POST route for user login
router.post('/login', authController.login);

router.get('/getConfig', authenticate, authController.getConfig);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;
