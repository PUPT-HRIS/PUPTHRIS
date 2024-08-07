const Employee = require('../models/employeeModel');

exports.addEmployee = async (req, res) => {
  try {
    const newEmployee = await Employee.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updatedData = req.body;
    const result = await Employee.update(updatedData, {
      where: { EmployeeID: employeeId }
    });
    if (result[0] === 0) {
      res.status(404).json({ message: 'Employee record not found' });
    } else {
      const updatedEmployee = await Employee.findOne({ where: { EmployeeID: employeeId } });
      res.status(200).json(updatedEmployee);
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findOne({ where: { EmployeeID: employeeId } });
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).send('Employee record not found');
    }
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).send('Internal Server Error');
  }
};
