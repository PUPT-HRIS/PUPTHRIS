const express = require('express');
const router = express.Router();
const loginController = require('../controllers/authController');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const resetPasswordController = require('../controllers/resetPasswordController');
const changePasswordController = require('../controllers/changePasswordController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/login', loginController.login);
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/reset-password/:token', resetPasswordController.resetPassword);
router.post('/change-password', authenticateJWT, changePasswordController.changePassword);

module.exports = router;
