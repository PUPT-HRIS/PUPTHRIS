const express = require('express');
const collegeCampusController = require('../controllers/collegeCampusController');
const router = express.Router();
// Get all college campuses
router.get('/',collegeCampusController.getAllCollegeCampuses);

// Get a single college campus by ID
router.get('/:id',collegeCampusController.getCollegeCampusById);

// Create a new college campus
router.post('/', collegeCampusController.createCollegeCampus);

// Update a college campus
router.put('/:id', collegeCampusController.updateCollegeCampus);

// Delete a college campus
router.delete('/:id', collegeCampusController.deleteCollegeCampus);

module.exports = router;
