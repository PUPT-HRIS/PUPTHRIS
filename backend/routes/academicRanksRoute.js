const express = require('express');
const router = express.Router();
const academicRankController = require('../controllers/academicRanksController');

// Add or update academic rank
router.post('/', academicRankController.addOrUpdateAcademicRank);

// Get academic rank for a user
router.get('/:UserID', academicRankController.getAcademicRank);

// Remove academic rank for a user
router.delete('/:UserID', academicRankController.removeAcademicRank);

module.exports = router;