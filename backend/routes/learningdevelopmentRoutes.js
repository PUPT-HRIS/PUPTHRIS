const express = require('express');
const learningdevelopmentController = require('../controllers/learningdevelopmentController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, learningdevelopmentController.addLearningDevelopment);
router.patch('/update/:id', authenticateJWT, learningdevelopmentController.updateLearningDevelopment);
router.get('/user/:id', authenticateJWT, learningdevelopmentController.getLearningDevelopments);
router.delete('/delete/:id', authenticateJWT, learningdevelopmentController.deleteLearningDevelopment);

module.exports = router;
