const CollegeCampus = require('../models/collegeCampusModel');

// Get all college campuses
exports.getAllCollegeCampuses = async (req, res) => {
  try {
    const campuses = await CollegeCampus.findAll();
    res.json(campuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching college campuses', error: error.message });
  }
};

// Get a single college campus by ID
exports.getCollegeCampusById = async (req, res) => {
  try {
    const campus = await CollegeCampus.findByPk(req.params.id);
    if (campus) {
      res.json(campus);
    } else {
      res.status(404).json({ message: 'College campus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching college campus', error: error.message });
  }
};

// Create a new college campus
exports.createCollegeCampus = async (req, res) => {
  try {
    const newCampus = await CollegeCampus.create(req.body);
    res.status(201).json(newCampus);
  } catch (error) {
    res.status(400).json({ message: 'Error creating college campus', error: error.message });
  }
};

// Update a college campus
exports.updateCollegeCampus = async (req, res) => {
  try {
    const updated = await CollegeCampus.update(req.body, {
      where: { CollegeCampusID: req.params.id }
    });
    if (updated[0] === 1) {
      res.json({ message: 'College campus updated successfully' });
    } else {
      res.status(404).json({ message: 'College campus not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating college campus', error: error.message });
  }
};

// Delete a college campus
exports.deleteCollegeCampus = async (req, res) => {
  try {
    const deleted = await CollegeCampus.destroy({
      where: { CollegeCampusID: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'College campus deleted successfully' });
    } else {
      res.status(404).json({ message: 'College campus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting college campus', error: error.message });
  }
};
