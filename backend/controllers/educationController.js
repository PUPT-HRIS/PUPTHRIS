const Education = require('../models/educationModel');

exports.addEducation = async (req, res) => {
  try {
    const newEducation = await Education.create(req.body);
    res.status(201).json(newEducation);
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Invalid UserID. The user does not exist.' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const educationId = req.params.id;
    const updatedData = req.body;
    const result = await Education.update(updatedData, {
      where: { EducationID: educationId }
    });
    if (result[0] === 0) {
      res.status(404).send('Education record not found');
    } else {
      const updatedEducation = await Education.findOne({ where: { EducationID: educationId } });
      res.status(200).json(updatedEducation);
    }
  } catch (err) {
    console.error('Error updating education:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getEducation = async (req, res) => {
  try {
    const educationId = req.params.id;
    const education = await Education.findOne({ where: { EducationID: educationId } });
    if (education) {
      res.status(200).json(education);
    } else {
      res.status(404).send('Education record not found');
    }
  } catch (error) {
    console.error('Error getting education:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getEducationByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const educationRecords = await Education.findAll({ where: { UserID: userId } });
    if (educationRecords) {
      res.status(200).json(educationRecords);
    } else {
      res.status(404).send('No education records found for this user');
    }
  } catch (error) {
    console.error('Error getting education records:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const educationId = req.params.id;
    const result = await Education.destroy({ where: { EducationID: educationId } });
    if (result === 0) {
      res.status(404).json({ error: 'Education record not found' });
    } else {
      res.status(200).json({ message: 'Education record deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting education record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
