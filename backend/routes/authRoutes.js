const express = require('express');
const router = express.Router();
const loginController = require('../controllers/authController');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const resetPasswordController = require('../controllers/resetPasswordController');

router.post('/login', loginController.login);
router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/reset-password/:token', resetPasswordController.resetPassword);

module.exports = router;
