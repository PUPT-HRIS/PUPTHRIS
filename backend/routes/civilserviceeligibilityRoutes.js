const express = require('express');
const civilserviceeligibilityController = require('../controllers/civilserviceeligibilityController');

const router = express.Router();

router.post('/add', civilserviceeligibilityController.addCivilServiceEligibility);

module.exports = router;
