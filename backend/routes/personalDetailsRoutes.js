const express = require('express');
const personalDetailsController = require('../controllers/personalDetailsController');
const authenticateJWT = require('../middleware/authMiddleware');  // Assuming you have an authentication middleware

const router = express.Router();

router.post('/add', authenticateJWT, personalDetailsController.addPersonalDetails);
router.patch('/update/:id', authenticateJWT, personalDetailsController.updatePersonalDetails);
router.get('/user/:userId', authenticateJWT, personalDetailsController.getPersonalDetails);


module.exports = router;
