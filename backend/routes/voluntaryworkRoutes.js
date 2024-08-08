const express = require('express');
const voluntaryworkController = require('../controllers/voluntaryworkController');

const router = express.Router();

router.post('/add', voluntaryworkController.addVoluntaryWork);
router.patch('/update/:id', voluntaryworkController.updateVoluntaryWork);
router.get('/:id', voluntaryworkController.getVoluntaryWork);
router.get('/employee/:employeeId', voluntaryworkController.getVoluntaryWorks);

module.exports = router;
