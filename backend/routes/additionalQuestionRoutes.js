const express = require('express');
const router = express.Router();
const additionalQuestionController = require('../controllers/additionalQuestionController');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, additionalQuestionController.getAdditionalQuestion);
router.post('/addOrUpdate', authenticateJWT, additionalQuestionController.addOrUpdateAdditionalQuestion);

module.exports = router;
