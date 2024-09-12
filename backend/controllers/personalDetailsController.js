const PersonalDetails = require('../models/personalDetailsModel');

exports.addPersonalDetails = async (req, res) => {
  try {
    // Attach the UserID from the JWT to the request body
    req.body.UserID = req.user.userId;
    
    // Create new personal details
    const newPersonalDetails = await PersonalDetails.create(req.body);
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
    
    // Ensure only the logged-in user's data is updated
    const result = await PersonalDetails.update(updatedData, {
      where: { PersonalDetailsID: personalDetailsId, UserID: req.user.userId }
    });
    
    if (result[0] === 0) {
      res.status(404).json({ message: 'Personal details record not found' });
    } else {
      const updatedPersonalDetails = await PersonalDetails.findOne({ where: { PersonalDetailsID: personalDetailsId, UserID: req.user.userId } });
      res.status(200).json(updatedPersonalDetails);
    }
  } catch (error) {
    console.error('Error updating personal details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getPersonalDetails = async (req, res) => {
  try {
    // Find the personal details for the user
    const personalDetails = await PersonalDetails.findOne({ where: { UserID: req.params.userId } });
    
    if (personalDetails) {
      res.status(200).json(personalDetails);
    } else {
      res.status(404).json({ message: 'Personal details record not found' });
    }
  } catch (error) {
    console.error('Error getting personal details:', error);
    res.status(500).send('Internal Server Error');
  }
};
