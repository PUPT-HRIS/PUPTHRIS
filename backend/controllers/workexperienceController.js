const WorkExperience = require('../models/workexperienceModel');

exports.addWorkExperience = async (req, res) => {
  try {
    const newWorkExperience = await WorkExperience.create(req.body);
    res.status(201).json(newWorkExperience);
  } catch (error) {
    console.error('Error adding work experience:', error);
    res.status(500).send('Internal Server Error');
  }
};
