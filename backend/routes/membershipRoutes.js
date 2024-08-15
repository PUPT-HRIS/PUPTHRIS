const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/add', authenticateJWT, membershipController.addMembership);
router.patch('/update/:id', authenticateJWT, membershipController.updateMembership);
router.get('/user/:id', authenticateJWT, membershipController.getMembershipsByUser);
router.delete('/delete/:id', authenticateJWT, membershipController.deleteMembership);

module.exports = router;
