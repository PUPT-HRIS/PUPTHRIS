const AdditionalQuestion = require('../models/AdditionalQuestion');

exports.addAdditionalQuestion = async (req, res) => {
  try {
    const newAdditionalQuestion = await AdditionalQuestion.create(req.body);
    res.status(201).json(newAdditionalQuestion);
  } catch (error) {
    console.error('Error adding additional question:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateAdditionalQuestion = async (req, res) => {
  try {
    const responseId = req.params.id;
    const updatedData = req.body;
    const result = await AdditionalQuestion.update(updatedData, {
      where: { ResponseID: responseId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Additional question record not found' });
    } else {
      const updatedAdditionalQuestion = await AdditionalQuestion.findOne({ where: { ResponseID: responseId } });
      res.status(200).json(updatedAdditionalQuestion);
    }
  } catch (error) {
    console.error('Error updating additional question:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAdditionalQuestion = async (req, res) => {
  try {
    const responseId = req.params.id;
    const additionalQuestion = await AdditionalQuestion.findOne({ where: { ResponseID: responseId } });
    if (additionalQuestion) {
      res.status(200).json(additionalQuestion);
    } else {
      res.status(404).send('Additional question record not found');
    }
  } catch (error) {
    console.error('Error getting additional question:', error);
    res.status(500).send('Internal Server Error');
  }
};
