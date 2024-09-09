// roleRoutes.js
const express = require('express');
const roleController = require('../controllers/roleController');
const router = express.Router();

router.post('/add', roleController.addRole); // Add a new role
router.get('/', roleController.getRoles); // Get all roles
router.put('/:id', roleController.updateRole); // Update a role by ID
router.delete('/:id', roleController.deleteRole); // Delete a role by ID

module.exports = router;
