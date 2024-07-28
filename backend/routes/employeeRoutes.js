const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.post('/add', employeeController.addEmployee);

module.exports = router;
