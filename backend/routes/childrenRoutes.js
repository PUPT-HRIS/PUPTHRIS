const express = require('express');
const childrenController = require('../controllers/childrenController');

const router = express.Router();

router.post('/add', childrenController.addChild);
router.patch('/update/:id', childrenController.updateChild);
router.get('/:id', childrenController.getChild);
router.get('/employee/:employeeId', childrenController.getChildrenByEmployeeId);
router.delete('/delete/:id', childrenController.deleteChild);

module.exports = router;
