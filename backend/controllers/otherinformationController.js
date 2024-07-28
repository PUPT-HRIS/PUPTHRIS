const OtherInformation = require('../models/otherinformationModel');

exports.addOtherInformation = async (req, res) => {
  try {
    const newOtherInformation = await OtherInformation.create(req.body);
    res.status(201).json(newOtherInformation);
  } catch (error) {
    console.error('Error adding other information:', error);
    res.status(500).send('Internal Server Error');
  }
};
