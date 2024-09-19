const express = require('express');
const router = express.Router();
const pdsController = require('../controllers/pdsController');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/download-pds', authenticateJWT, pdsController.generatePDS);
router.get('/download-pds/:userId', authenticateJWT, pdsController.generatePDSForUser);

module.exports = router;
