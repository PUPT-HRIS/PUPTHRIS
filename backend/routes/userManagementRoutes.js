const express = require('express');
const userManagementController = require('../controllers/userManagementController');
const router = express.Router();

router.put('/employment-type', userManagementController.updateEmploymentType);
router.put('/roles', userManagementController.updateUserRoles);
router.get('/users', userManagementController.getAllUsers);
router.get('/user/:UserID', userManagementController.getUserDetails);
router.get('/roles', userManagementController.getAllRoles);
router.put('/users/:userId/department', userManagementController.updateUserDepartment);
router.put('/users/:userId/toggle-active', userManagementController.toggleUserActiveStatus);
router.put('/update-campus/:userId', userManagementController.updateUserCampus);

module.exports = router;
