const express = require('express');
const civilserviceeligibilityController = require('../controllers/civilserviceeligibilityController');

const router = express.Router();

router.post('/add', civilserviceeligibilityController.addCivilServiceEligibility);
router.patch('/update/:id', civilserviceeligibilityController.updateCivilServiceEligibility);
router.get('/:id', civilserviceeligibilityController.getCivilServiceEligibility);

module.exports = router;
