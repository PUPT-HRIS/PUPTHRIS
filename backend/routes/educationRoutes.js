const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');

router.post('/add', educationController.addEducation);

module.exports = router;
