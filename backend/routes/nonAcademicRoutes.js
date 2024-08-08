const express = require('express');
const router = express.Router();
const nonacademicController = require('../controllers/nonacademicController');

router.post('/add', nonacademicController.addNonAcademic);
router.patch('/update/:id', nonacademicController.updateNonAcademic);
router.get('/employee/:id', nonacademicController.getNonAcademicsByEmployee);
router.delete('/delete/:id', nonacademicController.deleteNonAcademic);  // Add this line

module.exports = router;
