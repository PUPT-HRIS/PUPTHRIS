const express = require('express');
const router = express.Router();
const profileImageController = require('../controllers/profileImageController');

router.post('/upload', profileImageController.uploadProfileImage);
router.get('/:userId', profileImageController.getProfileImage);

module.exports = router;
