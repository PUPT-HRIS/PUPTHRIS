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

exports.updateOtherInformation = async (req, res) => {
  try {
    const otherInformationId = req.params.id;
    const updatedData = req.body;
    const result = await OtherInformation.update(updatedData, {
      where: { OtherInformationID: otherInformationId }
    });
    if (result[0] === 0) {
      res.status(404).send('Other Information record not found');
    } else {
      res.status(200).send('Other Information updated successfully');
    }
  } catch (err) {
    console.error('Error updating other information:', err);
    res.status(500).send('Internal Server Error');
  }
};