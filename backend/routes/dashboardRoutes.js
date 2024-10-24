const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard-data', dashboardController.getDashboardData);
router.get('/user-dashboard-data/:userId', dashboardController.getUserDashboardData);
module.exports = router;
