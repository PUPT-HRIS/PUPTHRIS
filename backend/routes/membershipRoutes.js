const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

router.post('/add', membershipController.addMembership);
router.patch('/update/:id', membershipController.updateMembership);
router.get('/employee/:id', membershipController.getMembershipsByEmployee);
router.delete('/delete/:id', membershipController.deleteMembership);  // Add this line

module.exports = router;
