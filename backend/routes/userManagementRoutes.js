const express = require('express');
const userManagementController = require('../controllers/userManagementController');

const router = express.Router();

// Route to update user's employment type
router.put('/employment-type', userManagementController.updateEmploymentType);

// Route to update user's roles
router.put('/roles', userManagementController.updateUserRoles);

// Route to get user details
router.get('/:UserID', userManagementController.getUserDetails);

module.exports = router;
