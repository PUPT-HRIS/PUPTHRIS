const express = require('express');
const learningdevelopmentController = require('../controllers/learningdevelopmentController');

const router = express.Router();

router.post('/add', learningdevelopmentController.addLearningDevelopment);

module.exports = router;
