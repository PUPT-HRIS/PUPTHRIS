const AdditionalQuestion = require('../models/additionalQuestionModel');

exports.addOrUpdateAdditionalQuestion = async (req, res) => {
  try {
    const existingRecord = await AdditionalQuestion.findOne({ where: { UserID: req.user.userId } });

    if (existingRecord) {
      // If record exists, update it
      const updatedData = await existingRecord.update(req.body);
      res.status(200).json(updatedData);
    } else {
      // If no record exists, create a new one
      const newRecord = await AdditionalQuestion.create({
        ...req.body,
        UserID: req.user.userId
      });
      res.status(201).json(newRecord);
    }
  } catch (error) {
    console.error('Error in addOrUpdateAdditionalQuestion:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAdditionalQuestion = async (req, res) => {
  try {
    const record = await AdditionalQuestion.findOne({ where: { UserID: req.user.userId } });

    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).send('No additional question record found for this user');
    }
  } catch (error) {
    console.error('Error in getAdditionalQuestion:', error);
    res.status(500).send('Internal Server Error');
  }
};
