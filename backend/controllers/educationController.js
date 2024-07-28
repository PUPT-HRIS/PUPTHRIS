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
