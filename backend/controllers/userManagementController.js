const sequelize = require('../config/db.config');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Coordinator = require('../models/coordinatorModel');
const { Department, CollegeCampus } = require('../models/associations');
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
        {
          model: CollegeCampus,
          as: 'CollegeCampus',
          attributes: ['Name']
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
    const { campusId } = req.query;
    console.log('Received campusId:', campusId); // Add this log

    let whereClause = {};
    if (campusId) {
      whereClause.CollegeCampusID = campusId;
    }

    const users = await User.findAll({
      where: whereClause,
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
        {
          model: CollegeCampus,
          as: 'CollegeCampus',
          attributes: ['Name']
        },
      ],
      attributes: { include: ['isActive'] },
    });

    console.log(`Found ${users.length} users for campus ID ${campusId}`); // Add this log

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

// Add this new function
exports.toggleUserActiveStatus = async (req, res) => {
  let transaction;
  try {
    console.log('Toggling user status for userId:', req.params.userId);
    
    if (!sequelize) {
      throw new Error('Database connection not established');
    }
    transaction = await sequelize.transaction();

    const { userId } = req.params;
    const user = await User.findByPk(userId, { transaction });
    
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user status:', user.isActive);
    user.isActive = !user.isActive;
    await user.save({ transaction });
    console.log('Updated user status:', user.isActive);

    // If the user is being deactivated and is a coordinator, remove them from the coordinator position
    if (!user.isActive) {
      const coordinator = await Coordinator.findOne({ where: { UserID: userId }, transaction });
      if (coordinator) {
        console.log('User is a coordinator, removing from position');
        const department = await Department.findByPk(coordinator.DepartmentID, { transaction });
        if (department) {
          department.CoordinatorID = null;
          await department.save({ transaction });
        }
        await coordinator.destroy({ transaction });
      }
    }

    await transaction.commit();
    res.status(200).json({ message: 'User status updated', isActive: user.isActive });
  } catch (error) {
    console.error('Error in toggleUserActiveStatus:', error);
    if (transaction) await transaction.rollback();
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Add this new function
exports.updateUserCampus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { campusId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const campus = await CollegeCampus.findByPk(campusId);
    if (!campus) {
      return res.status(404).json({ message: 'College Campus not found' });
    }

    user.CollegeCampusID = campusId;
    await user.save();

    res.status(200).json({ message: 'User campus updated successfully', user });
  } catch (error) {
    console.error('Error updating user campus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
