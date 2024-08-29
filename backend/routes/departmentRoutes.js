const express = require('express');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

router.post('/add', departmentController.addDepartment);
router.get('/', departmentController.getDepartments);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
