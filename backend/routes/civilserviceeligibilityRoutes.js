const express = require('express');
const civilserviceeligibilityController = require('../controllers/civilserviceeligibilityController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, civilserviceeligibilityController.addCivilServiceEligibility);
router.patch('/update/:id', authenticateJWT, civilserviceeligibilityController.updateCivilServiceEligibility);
router.get('/employee', authenticateJWT, civilserviceeligibilityController.getCivilServiceEligibilitiesByEmployee);

module.exports = router;
