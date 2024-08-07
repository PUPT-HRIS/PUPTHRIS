const express = require('express');
const { addEmployee, updateEmployee, getEmployee } = require('../controllers/employeeController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, addEmployee);
router.patch('/update/:id', authenticateJWT, updateEmployee);
router.get('/:id', authenticateJWT, getEmployee);

module.exports = router;
