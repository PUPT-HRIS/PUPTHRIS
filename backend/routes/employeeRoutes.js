const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/:id', employeeController.getEmployee);
router.post('/add', employeeController.addEmployee);
router.patch('/update/:id', employeeController.updateEmployee);

module.exports = router;
