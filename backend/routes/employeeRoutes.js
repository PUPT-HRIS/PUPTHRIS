const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.post('/', employeeController.addEmployee);

module.exports = router;
