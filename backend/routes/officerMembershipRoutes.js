const express = require('express');
const officershipMembershipController = require('../controllers/officerMembershipController');

const router = express.Router();

router.post('/add', officershipMembershipController.addOfficershipMembership);
router.patch('/update/:id', officershipMembershipController.updateOfficershipMembership);
router.get('/:id', officershipMembershipController.getOfficershipMembership);
router.get('/user/:userId', officershipMembershipController.getOfficershipMembershipsByUserId);
router.delete('/delete/:id', officershipMembershipController.deleteOfficershipMembership);

module.exports = router;
