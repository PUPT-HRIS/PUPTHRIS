const express = require('express');
const otherinformationController = require('../controllers/otherinformationController');

const router = express.Router();

router.post('/add', otherinformationController.addOtherInformation);

module.exports = router;
