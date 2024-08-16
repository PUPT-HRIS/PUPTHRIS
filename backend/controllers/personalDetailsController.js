const PersonalDetails = require('../models/PersonalDetails');

exports.addPersonalDetails = async (req, res) => {
  try {
    const newPersonalDetails = await PersonalDetails.create({
      ...req.body,
      UserID: req.user.userId,  // Assuming you're using authentication middleware to get the logged-in user ID
    });
    res.status(201).json(newPersonalDetails);
  } catch (error) {
    console.error('Error adding personal details:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updatePersonalDetails = async (req, res) => {
  try {
    const personalDetailsId = req.params.id;
    const updatedData = req.body;
    const result = await PersonalDetails.update(updatedData, {
      where: { PersonalDetailsID: personalDetailsId, UserID: req.user.userId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Personal details record not found' });
    } else {
      const updatedPersonalDetails = await PersonalDetails.findOne({ where: { PersonalDetailsID: personalDetailsId } });
      res.status(200).json(updatedPersonalDetails);
    }
  } catch (error) {
    console.error('Error updating personal details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getPersonalDetails = async (req, res) => {
  try {
    const personalDetails = await PersonalDetails.findOne({ where: { UserID: req.user.userId } });
    if (personalDetails) {
      res.status(200).json(personalDetails);
    } else {
      res.status(404).send('Personal details record not found');
    }
  } catch (error) {
    console.error('Error getting personal details:', error);
    res.status(500).send('Internal Server Error');
  }
};
