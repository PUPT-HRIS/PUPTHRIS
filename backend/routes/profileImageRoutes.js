const express = require('express');
const router = express.Router();
const profileImageController = require('../controllers/profileImageController');

router.post('/upload', profileImageController.uploadProfileImage);
router.get('/:userID', profileImageController.getProfileImage);
router.delete('/:userID', profileImageController.deleteProfileImage);

module.exports = router;
