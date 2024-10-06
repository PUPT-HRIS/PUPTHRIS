const NonAcademic = require('../models/nonAcademicModel');

exports.addNonAcademic = async (req, res) => {
  try {
    const newNonAcademic = await NonAcademic.create({
      ...req.body,
      userID: req.user.userId
    });
    res.status(201).json(newNonAcademic);
  } catch (error) {
    console.error('Error adding non-academic distinction:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateNonAcademic = async (req, res) => {
  try {
    const nonAcademicId = req.params.id;
    const updatedData = req.body;
    const result = await NonAcademic.update(updatedData, {
      where: { NonAcademicID: nonAcademicId, userID: req.user.userId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Non-academic distinction record not found' });
    } else {
      res.status(200).json({ message: 'Non-academic distinction updated successfully' });
    }
  } catch (err) {
    console.error('Error updating non-academic distinction:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getNonAcademicsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const nonAcademics = await NonAcademic.findAll({ where: { userID: userId } });
    res.status(200).json(nonAcademics);
  } catch (error) {
    console.error('Error fetching non-academic distinctions:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteNonAcademic = async (req, res) => {
  try {
    const nonAcademicId = req.params.id;
    const result = await NonAcademic.destroy({
      where: { NonAcademicID: nonAcademicId, userID: req.user.userId }
    });
    if (result === 0) {
      res.status(404).json({ error: 'Non-academic distinction record not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting non-academic distinction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
