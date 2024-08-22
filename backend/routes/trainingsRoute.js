const express = require('express');
const trainingsController = require('../controllers/trainingsController');

const router = express.Router();

router.post('/add', trainingsController.addTraining);
router.patch('/update/:id', trainingsController.updateTraining);
router.get('/:id', trainingsController.getTraining);
router.get('/user/:userId', trainingsController.getTrainingsByUserId);
router.delete('/delete/:id', trainingsController.deleteTraining);

module.exports = router;
