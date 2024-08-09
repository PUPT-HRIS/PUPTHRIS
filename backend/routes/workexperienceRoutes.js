const express = require('express');
const workexperienceController = require('../controllers/workexperienceController');

const router = express.Router();

router.post('/add', workexperienceController.addWorkExperience);
router.patch('/update/:id', workexperienceController.updateWorkExperience);
router.get('/:id', workexperienceController.getWorkExperience);
router.get('/employee/:employeeId', workexperienceController.getWorkExperiencesByEmployee);
router.delete('/delete/:id', workexperienceController.deleteWorkExperience);

module.exports = router;
