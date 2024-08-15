const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');

router.post('/add', educationController.addEducation);
router.patch('/update/:id', educationController.updateEducation);
router.get('/:id', educationController.getEducation); 
router.get('/user/:userId', educationController.getEducationByUser);
router.delete('/delete/:id', educationController.deleteEducation);

module.exports = router;
