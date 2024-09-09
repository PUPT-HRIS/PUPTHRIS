const User = require('../models/userModel');
const Role = require('../models/roleModel');
const { Department } = require('../models/associations');
require('dotenv').config();

// Update a user's employment type
exports.updateEmploymentType = async (req, res) => {
  try {
    const { UserID, EmploymentType } = req.body;

    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.EmploymentType = EmploymentType;
    await user.save();

    res.status(200).json({ message: 'Employment type updated successfully', user });
  } catch (error) {
    console.error('Error updating employment type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user's roles
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

// Get user details including roles and employment type
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
