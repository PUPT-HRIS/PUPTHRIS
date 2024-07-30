const Employee = require('../models/employeeModel');

exports.addEmployee = async (req, res) => {
  try {
    const employee = req.body;
    await Employee.create(employee);
    res.status(201).send('Employee added successfully');
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 

    const [updated] = await Employee.update(updates, {
      where: { EmployeeID: id }
    });

    if (updated) {
      const updatedEmployee = await Employee.findOne({ where: { EmployeeID: id } });
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ where: { EmployeeID: id } });

    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).send('Internal Server Error');
  }
};