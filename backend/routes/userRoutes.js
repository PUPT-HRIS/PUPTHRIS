const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/add', userController.addUser); // Add a user
router.get('/', userController.getUsers); // Get all users
router.get('/:id', userController.getUserById); // Get user by ID
router.put('/:id/toggle-active', userController.toggleUserActiveStatus); // New route

module.exports = router;
