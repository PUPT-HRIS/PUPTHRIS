const express = require('express');
const basicDetailsController = require('../controllers/basicDetailsController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, basicDetailsController.addBasicDetails);
router.patch('/update/:id', authenticateJWT, basicDetailsController.updateBasicDetails);
router.get('/:userId', authenticateJWT, basicDetailsController.getBasicDetails);

module.exports = router;
