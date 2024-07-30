const Education = require('../models/educationModel');

exports.addEducation = async (req, res) => {
  try {
    const newEducation = await Education.create(req.body);
    res.status(201).json(newEducation);
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Invalid EmployeeID. The employee does not exist.' });
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
      res.status(200).send('Education updated successfully');
    }
  } catch (err) {
    console.error('Error updating education:', err);
    res.status(500).send('Internal Server Error');
  }
};