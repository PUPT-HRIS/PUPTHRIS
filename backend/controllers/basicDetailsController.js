const BasicDetails = require('../models/basicDetailsModel');

exports.addBasicDetails = async (req, res) => {
  try {
    const newBasicDetails = await BasicDetails.create(req.body);
    res.status(201).json(newBasicDetails);
  } catch (error) {
    console.error('Error adding basic details:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateBasicDetails = async (req, res) => {
  try {
    const basicDetailsId = req.params.id;
    const updatedData = req.body;
    const result = await BasicDetails.update(updatedData, {
      where: { BasicDetailsID: basicDetailsId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Basic details record not found' });
    } else {
      const updatedBasicDetails = await BasicDetails.findOne({ where: { BasicDetailsID: basicDetailsId } });
      res.status(200).json(updatedBasicDetails);
    }
  } catch (error) {
    console.error('Error updating basic details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getBasicDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const basicDetails = await BasicDetails.findOne({ where: { UserID: userId } });
    if (basicDetails) {
      res.status(200).json(basicDetails);
    } else {
      res.status(404).send('Basic details record not found');
    }
  } catch (error) {
    console.error('Error getting basic details:', error);
    res.status(500).send('Internal Server Error');
  }
};
