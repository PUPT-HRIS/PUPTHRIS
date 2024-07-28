const express = require('express');
const voluntaryworkController = require('../controllers/voluntaryworkController');

const router = express.Router();

router.post('/add', voluntaryworkController.addVoluntaryWork);

module.exports = router;
