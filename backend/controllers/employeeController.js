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
