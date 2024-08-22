const Trainings = require('../models/trainingsModel');

exports.addTraining = async (req, res) => {
  try {
    const newTraining = await Trainings.create(req.body);
    res.status(201).json(newTraining);
  } catch (error) {
    console.error('Error adding training:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await Trainings.update(updates, {
      where: { TrainingID: id }
    });
    if (updated) {
      const updatedTraining = await Trainings.findOne({ where: { TrainingID: id } });
      res.status(200).json({ training: updatedTraining });
    } else {
      res.status(404).send('Training not found');
    }
  } catch (err) {
    console.error('Error updating training:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Trainings.findOne({ where: { TrainingID: id } });
    if (training) {
      res.status(200).json(training);
    } else {
      res.status(404).send('Training not found');
    }
  } catch (error) {
    console.error('Error getting training:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getTrainingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainings = await Trainings.findAll({ where: { UserID: userId } });
    if (trainings.length > 0) {
      res.status(200).json(trainings);
    } else {
      res.status(404).send('No trainings found for this user');
    }
  } catch (error) {
    console.error('Error getting trainings:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Trainings.destroy({ where: { TrainingID: id } });
    if (result) {
      res.status(200).json({ message: 'Training deleted successfully' });
    } else {
      res.status(404).json({ error: 'Training not found' });
    }
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
