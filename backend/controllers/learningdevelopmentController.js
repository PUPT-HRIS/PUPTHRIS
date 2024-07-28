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
