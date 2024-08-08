const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');

router.post('/add', educationController.addEducation);
router.patch('/update/:id', educationController.updateEducation);
router.get('/:id', educationController.getEducation); 
router.get('/employee/:employeeId', educationController.getEducationByEmployee);
router.delete('/delete/:id', educationController.deleteEducation);

module.exports = router;
