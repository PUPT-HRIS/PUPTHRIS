const LearningDevelopment = require('../models/learningdevelopmentModel');

exports.addLearningDevelopment = async (req, res) => {
  try {
    const newLearningDevelopment = await LearningDevelopment.create({
      ...req.body,
      UserID: req.user.userId
    });
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
      where: { LearningDevelopmentID: learningDevelopmentId, UserID: req.user.userId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Learning development record not found' });
    } else {
      res.status(200).json({ message: 'Learning development updated successfully' });
    }
  } catch (err) {
    console.error('Error updating learning development:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getLearningDevelopments = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log('Backend: Fetching learning developments for user ID:', userId);
    const learningDevelopments = await LearningDevelopment.findAll({ where: { UserID: userId } });
    console.log('Backend: Found learning developments:', learningDevelopments);
    res.status(200).json(learningDevelopments);
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteLearningDevelopment = async (req, res) => {
  try {
    const learningDevelopmentId = req.params.id;
    const result = await LearningDevelopment.destroy({
      where: { LearningDevelopmentID: learningDevelopmentId, UserID: req.user.userId }
    });
    if (result === 0) {
      res.status(404).json({ message: 'Learning development record not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting learning development:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
