const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');

router.post('/add', educationController.addEducation);
router.patch('/update/:id', educationController.updateEducation);

module.exports = router;
