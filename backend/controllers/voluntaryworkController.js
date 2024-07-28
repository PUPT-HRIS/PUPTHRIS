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
