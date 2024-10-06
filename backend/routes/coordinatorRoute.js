const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');

// Get all departments with their coordinators
router.get('/departments-with-coordinators', coordinatorController.getAllDepartmentsWithCoordinators);

// Assign a coordinator to a department
router.post('/assign', coordinatorController.assignCoordinator);

// Remove a coordinator from a department
router.delete('/remove/:departmentId', coordinatorController.removeCoordinator);

// Get coordinator details for a specific department
router.get('/department/:departmentId', coordinatorController.getCoordinatorByDepartment);

// Update coordinator for a department (this route might not be necessary if we're using the assign route for both assigning and updating)
// router.put('/update/:departmentId', coordinatorController.updateCoordinator);

module.exports = router;
