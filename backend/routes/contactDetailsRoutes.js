const express = require('express');
const router = express.Router();
const contactDetailsController = require('../controllers/contactDetailsController');

// Route to add contact details
router.post('/add', contactDetailsController.addContactDetails);

// Route to update contact details
router.put('/update/:id', contactDetailsController.updateContactDetails);

// Route to get contact details by ID
router.get('/:id', contactDetailsController.getContactDetails);

module.exports = router;
