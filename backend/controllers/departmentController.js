const Department = require('../models/departmentModel');

exports.addDepartment = async (req, res) => {
  try {
    const { DepartmentName, Description } = req.body;
    const newDepartment = await Department.create({ DepartmentName, Description });
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { DepartmentName, Description } = req.body;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).send('Department not found');
    }

    department.DepartmentName = DepartmentName;
    department.Description = Description;
    await department.save();

    res.status(200).json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).send('Department not found');
    }

    await department.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).send('Internal Server Error');
  }
};
