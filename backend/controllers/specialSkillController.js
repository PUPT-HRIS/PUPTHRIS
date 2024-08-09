const SpecialSkill = require('../models/specialSkillModel');

exports.addSpecialSkill = async (req, res) => {
  try {
    const newSpecialSkill = await SpecialSkill.create(req.body);
    res.status(201).json(newSpecialSkill);
  } catch (error) {
    console.error('Error adding special skill:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateSpecialSkill = async (req, res) => {
  try {
    const specialSkillId = req.params.id;
    const updatedData = req.body;
    console.log('Received data for update:', updatedData);
    const result = await SpecialSkill.update(updatedData, {
      where: { SpecialSkillsID: specialSkillId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Special skill record not found' });
    } else {
      res.status(200).json({ message: 'Special skill updated successfully' });
    }
  } catch (err) {
    console.error('Error updating special skill:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getSpecialSkillsByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const specialSkills = await SpecialSkill.findAll({ where: { EmployeeID: employeeId } });
    res.status(200).json(specialSkills);
  } catch (error) {
    console.error('Error fetching special skills:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteSpecialSkill = async (req, res) => {
  try {
    const specialSkillId = req.params.id;
    const result = await SpecialSkill.destroy({
      where: { SpecialSkillsID: specialSkillId }
    });
    if (result === 0) {
      res.status(404).json({ error: 'Special skill record not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting special skill:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};