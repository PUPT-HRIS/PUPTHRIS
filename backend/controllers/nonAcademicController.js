const NonAcademic = require('../models/nonacademicModel');

exports.addNonAcademic = async (req, res) => {
  try {
    const newNonAcademic = await NonAcademic.create(req.body);
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
    console.log('Received data for update:', updatedData);
    const result = await NonAcademic.update(updatedData, {
      where: { NonAcademicID: nonAcademicId }
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

exports.getNonAcademicsByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const nonAcademics = await NonAcademic.findAll({ where: { EmployeeID: employeeId } });
    res.status(200).json(nonAcademics);
  } catch (error) {
    console.error('Error fetching non-academic distinctions:', error);
    res.status(500).send('Internal Server Error');
  }
};
