const VoluntaryWork = require('../models/voluntaryworkModel');

exports.addVoluntaryWork = async (req, res) => {
  try {
    const newVoluntaryWork = await VoluntaryWork.create(req.body);
    res.status(201).json(newVoluntaryWork);
  } catch (error) {
    console.error('Error adding voluntary work:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateVoluntaryWork = async (req, res) => {
  try {
    const voluntaryWorkId = req.params.id;
    const updatedData = req.body;
    const result = await VoluntaryWork.update(updatedData, {
      where: { VoluntaryWorkID: voluntaryWorkId }
    });
    if (result[0] === 0) {
      res.status(404).send('Voluntary work record not found');
    } else {
      res.status(200).send('Voluntary work updated successfully');
    }
  } catch (err) {
    console.error('Error updating voluntary work:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getVoluntaryWork = async (req, res) => {
  try {
    const voluntaryWorkId = req.params.id;
    const voluntaryWork = await VoluntaryWork.findOne({ where: { VoluntaryWorkID: voluntaryWorkId } });
    if (voluntaryWork) {
      res.status(200).json(voluntaryWork);
    } else {
      res.status(404).send('Voluntary work record not found');
    }
  } catch (error) {
    console.error('Error getting voluntary work:', error);
    res.status(500).send('Internal Server Error');
  }
};