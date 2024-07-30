const LearningDevelopment = require('../models/learningdevelopmentModel');

exports.addLearningDevelopment = async (req, res) => {
  try {
    const newLearningDevelopment = await LearningDevelopment.create(req.body);
    res.status(201).json(newLearningDevelopment);
  } catch (error) {
    console.error('Error adding learning and development:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateLearningDevelopment = async (req, res) => {
  try {
    const learningDevelopmentId = req.params.id;
    const updatedData = req.body;
    const result = await LearningDevelopment.update(updatedData, {
      where: { LearningDevelopmentID: learningDevelopmentId }
    });
    if (result[0] === 0) {
      res.status(404).send('Learning Development record not found');
    } else {
      res.status(200).send('Learning Development updated successfully');
    }
  } catch (err) {
    console.error('Error updating learning development:', err);
    res.status(500).send('Internal Server Error');
  }
};