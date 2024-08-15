const express = require('express');
const workexperienceController = require('../controllers/workexperienceController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, workexperienceController.addWorkExperience);
router.patch('/update/:id', authenticateJWT, workexperienceController.updateWorkExperience);
router.get('/user/:id', authenticateJWT, workexperienceController.getWorkExperiencesByUser);
router.delete('/delete/:id', authenticateJWT, workexperienceController.deleteWorkExperience);

module.exports = router;
