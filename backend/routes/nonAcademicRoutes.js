const express = require('express');
const router = express.Router();
const nonacademicController = require('../controllers/nonAcademicController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/add', authenticateJWT, nonacademicController.addNonAcademic);
router.patch('/update/:id', authenticateJWT, nonacademicController.updateNonAcademic);
router.get('/user/:id', authenticateJWT, nonacademicController.getNonAcademicsByUser);
router.delete('/delete/:id', authenticateJWT, nonacademicController.deleteNonAcademic);

module.exports = router;
