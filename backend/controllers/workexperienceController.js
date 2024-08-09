const WorkExperience = require('../models/workexperienceModel');

exports.addWorkExperience = async (req, res) => {
  try {
    const newWorkExperience = await WorkExperience.create(req.body);
    res.status(201).json(newWorkExperience);
  } catch (error) {
    console.error('Error adding work experience:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(404).json({ error: 'Work experience record not found' });
    } else {
      res.status(200).json({ message: 'Work experience updated successfully' });
    }
  } catch (err) {
    console.error('Error updating work experience:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getWorkExperience = async (req, res) => {
  try {
    const workExperienceId = req.params.id;
    const workExperience = await WorkExperience.findOne({ where: { WorkExperienceID: workExperienceId } });
    if (workExperience) {
      res.status(200).json(workExperience);
    } else {
      res.status(404).json({ error: 'Work experience record not found' });
    }
  } catch (error) {
    console.error('Error getting work experience:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getWorkExperiencesByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const workExperiences = await WorkExperience.findAll({ where: { EmployeeID: employeeId } });
    if (workExperiences) {
      res.status(200).json(workExperiences);
    } else {
      res.status(404).json({ error: 'No work experience records found' });
    }
  } catch (error) {
    console.error('Error getting work experiences:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteWorkExperience = async (req, res) => {
  try {
    const workExperienceId = req.params.id;
    const result = await WorkExperience.destroy({
      where: { WorkExperienceID: workExperienceId }
    });
    if (result === 0) {
      res.status(404).json({ error: 'Work experience record not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
