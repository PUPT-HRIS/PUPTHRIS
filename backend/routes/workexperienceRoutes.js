const express = require('express');
const workexperienceController = require('../controllers/workexperienceController');

const router = express.Router();

router.post('/add', workexperienceController.addWorkExperience);

module.exports = router;
