const express = require('express');
const voluntaryworkController = require('../controllers/voluntaryworkController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, voluntaryworkController.addVoluntaryWork);
router.patch('/update/:id', authenticateJWT, voluntaryworkController.updateVoluntaryWork);
router.get('/:id', authenticateJWT, voluntaryworkController.getVoluntaryWork);
router.get('/user/:userId', authenticateJWT, voluntaryworkController.getVoluntaryWorks);
router.delete('/delete/:id', authenticateJWT, voluntaryworkController.deleteVoluntaryWork);

module.exports = router;
