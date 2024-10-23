const express = require('express');
const civilserviceeligibilityController = require('../controllers/civilserviceeligibilityController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, civilserviceeligibilityController.addCivilServiceEligibility);
router.patch('/update/:id', authenticateJWT, civilserviceeligibilityController.updateCivilServiceEligibility);
router.get('/employee/:userId', authenticateJWT, civilserviceeligibilityController.getCivilServiceEligibilitiesByEmployee);
router.delete('/delete/:id', authenticateJWT, civilserviceeligibilityController.deleteCivilServiceEligibility);

module.exports = router;
