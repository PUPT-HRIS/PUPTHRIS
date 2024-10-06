const User = require('../models/userModel');
const Role = require('../models/roleModel');
const { Department } = require('../models/associations');
require('dotenv').config();

exports.updateEmploymentType = async (req, res) => {
  try {
    const { UserID, EmploymentType } = req.body;

    console.log('Received request to update Employment Type for User:', UserID, 'to', EmploymentType); // Log request

    const user = await User.findByPk(UserID);
    if (!user) {
      console.log('User not found:', UserID);
      return res.status(404).json({ message: 'User not found' });
    }

    user.EmploymentType = EmploymentType;
    await user.save();

    console.log('Employment Type updated successfully for User:', UserID, EmploymentType); // Log successful update

    res.status(200).json({ message: 'Employment type updated successfully', user });
  } catch (error) {
    console.error('Error updating employment type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRoles = async (req, res) => {
  try {
    const { UserID, Roles } = req.body;

    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (Roles && Roles.length > 0) {
      const roles = await Role.findAll({ where: { RoleID: Roles } });
      await user.setRoles(roles);
    }

    res.status(200).json({ message: 'User roles updated successfully' });
  } catch (error) {
    console.error('Error updating user roles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { UserID } = req.params;

    const user = await User.findByPk(UserID, {
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName']
        },
        {
          model: Role,
          as: 'Roles',
          through: { attributes: [] },
          attributes: ['RoleName'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName'],
        },
        {
          model: Role,
          as: 'Roles',
          through: { attributes: [] },
          attributes: ['RoleID', 'RoleName'],
        },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserDepartment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { departmentId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await user.setDepartment(department);

    res.status(200).json({ message: 'User department updated successfully', user });
  } catch (error) {
    console.error('Error updating user department:', error);
    res.status(500).json({ message: 'Server error' });
  }
};