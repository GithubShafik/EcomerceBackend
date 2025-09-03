const express = require('express');
const { createUser, deleteUser, getAllUsers } = require('../controllers/userController'); // Ensure these are correctly imported
const authenticate = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

// POST route to create a new user (Super Admin only)
router.post('/create',authenticate, authorizeRole('super_admin'), userController.createUser);

// DELETE route to delete a user (Super Admin only)
router.delete('/:id', userController.deleteUser);

// GET route to fetch all users (Super Admin only)
router.get('/', userController.getAllUsers);

module.exports = router;
