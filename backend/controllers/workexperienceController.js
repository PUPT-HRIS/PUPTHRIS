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

exports.updateWorkExperience = async (req, res) => {
  try {
    const workExperienceId = req.params.id;
    const updatedData = req.body;
    const result = await WorkExperience.update(updatedData, {
      where: { WorkExperienceID: workExperienceId }
    });
    if (result[0] === 0) {
      res.status(404).send('Work experience record not found');
    } else {
      res.status(200).send('Work experience updated successfully');
    }
  } catch (err) {
    console.error('Error updating work experience:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getWorkExperience = async (req, res) => {
  try {
    const workExperienceId = req.params.id;
    const workExperience = await WorkExperience.findOne({ where: { WorkExperienceID: workExperienceId } });
    if (workExperience) {
      res.status(200).json(workExperience);
    } else {
      res.status(404).send('Work experience record not found');
    }
  } catch (error) {
    console.error('Error getting work experience:', error);
    res.status(500).send('Internal Server Error');
  }
};