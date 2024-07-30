const express = require('express');
const workexperienceController = require('../controllers/workexperienceController');

const router = express.Router();

router.post('/add', workexperienceController.addWorkExperience);
router.patch('/update/:id', workexperienceController.updateWorkExperience);
router.get('/:id', workexperienceController.getWorkExperience);

module.exports = router;
