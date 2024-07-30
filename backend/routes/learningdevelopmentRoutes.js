const express = require('express');
const learningdevelopmentController = require('../controllers/learningdevelopmentController');

const router = express.Router();

router.post('/add', learningdevelopmentController.addLearningDevelopment);
router.patch('/update/:id', learningdevelopmentController.updateLearningDevelopment);
router.get('/:id', learningdevelopmentController.getLearningDevelopment);

module.exports = router;
