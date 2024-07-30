const express = require('express');
const learningdevelopmentController = require('../controllers/learningdevelopmentController');

const router = express.Router();

router.post('/add', learningdevelopmentController.addLearningDevelopment);
router.patch('/update/:id', learningdevelopmentController.updateLearningDevelopment);

module.exports = router;
