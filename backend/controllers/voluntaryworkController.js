const VoluntaryWork = require('../models/voluntaryworkModel');

exports.addVoluntaryWork = async (req, res) => {
  try {
    const newVoluntaryWork = await VoluntaryWork.create({
      ...req.body,
      userID: req.user.userId,
    });
    res.status(201).json(newVoluntaryWork);
  } catch (error) {
    console.error('Error adding voluntary work:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateVoluntaryWork = async (req, res) => {
  try {
    const voluntaryWorkId = req.params.id;
    const updatedData = req.body;
    const result = await VoluntaryWork.update(updatedData, {
      where: { VoluntaryWorkID: voluntaryWorkId, userID: req.user.userId }
    });
    if (result[0] === 0) {
      res.status(404).json({ error: 'Voluntary work record not found' });
    } else {
      res.status(200).json({ message: 'Voluntary work updated successfully' });
    }
  } catch (err) {
    console.error('Error updating voluntary work:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getVoluntaryWork = async (req, res) => {
  try {
    const voluntaryWorkId = parseInt(req.params.id);
    const voluntaryWork = await VoluntaryWork.findOne({ where: { VoluntaryWorkID: voluntaryWorkId, userID: req.user.userId } });
    if (voluntaryWork) {
      res.status(200).json(voluntaryWork);
    } else {
      res.status(404).json({ error: 'Voluntary work record not found' });
    }
  } catch (error) {
    console.error('Error getting voluntary work:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getVoluntaryWorks = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const voluntaryWorks = await VoluntaryWork.findAll({ where: { userID: userId } });
    res.status(200).json(voluntaryWorks);
  } catch (error) {
    console.error('Error getting voluntary works:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteVoluntaryWork = async (req, res) => {
  try {
    const voluntaryWorkId = req.params.id;
    const result = await VoluntaryWork.destroy({
      where: { VoluntaryWorkID: voluntaryWorkId, userID: req.user.userId }
    });
    if (result === 0) {
      res.status(404).json({ error: 'Voluntary work record not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting voluntary work:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
