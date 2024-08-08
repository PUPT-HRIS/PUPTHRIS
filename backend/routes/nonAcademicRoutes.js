const express = require('express');
const router = express.Router();
const nonacademicController = require('../controllers/nonacademicController');

router.post('/add', nonacademicController.addNonAcademic);
router.patch('/update/:id', nonacademicController.updateNonAcademic);
router.get('/employee/:id', nonacademicController.getNonAcademicsByEmployee);

module.exports = router;
