const sequelize = require('../config/db.config');
const Coordinator = require('../models/coordinatorModel');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const CollegeCampus = require('../models/collegeCampusModel');

exports.assignCoordinator = async (req, res) => {
  console.log('Received request body:', req.body);
  const transaction = await sequelize.transaction();
  try {
    const { departmentId, userId } = req.body;

    // Find the department
    const department = await Department.findByPk(departmentId, { transaction });
    if (!department) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Department not found' });
    }

    // Find the user
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create coordinator
    const [coordinator, created] = await Coordinator.findOrCreate({
      where: { DepartmentID: departmentId },
      defaults: { UserID: userId },
      transaction
    });

    if (!created) {
      // Update existing coordinator
      await coordinator.update({ UserID: userId }, { transaction });
    }

    // Update department
    await department.update({ CoordinatorID: userId }, { transaction });

    await transaction.commit();

    // Fetch updated department with coordinator info
    const updatedDepartment = await Department.findByPk(departmentId, {
      include: [{
        model: User,
        as: 'Coordinator',
        attributes: ['UserID', 'FirstName', 'Surname']
      }]
    });

    res.status(200).json({ 
      message: 'Coordinator assigned successfully', 
      department: updatedDepartment 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error assigning coordinator:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.removeCoordinator = async (req, res) => {
  let transaction;
  try {
    if (!sequelize) {
      throw new Error('Database connection not established');
    }
    transaction = await sequelize.transaction();

    const { departmentId } = req.params;

    // Find the coordinator
    const coordinator = await Coordinator.findOne({ 
      where: { DepartmentID: departmentId },
      transaction
    });

    if (!coordinator) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Coordinator not found for this department' });
    }

    // Update the department to set CoordinatorID to null
    await Department.update(
      { CoordinatorID: null },
      { where: { DepartmentID: departmentId }, transaction }
    );

    // Now remove the coordinator
    await coordinator.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Coordinator removed successfully' });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error removing coordinator:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getCoordinatorByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const coordinator = await Coordinator.findOne({
      where: { DepartmentID: departmentId },
      include: [
        { model: User, attributes: ['UserID', 'Fcode', 'FirstName', 'LastName', 'Email'] },
        { model: Department, attributes: ['DepartmentID', 'DepartmentName'] }
      ]
    });

    if (!coordinator) {
      return res.status(404).json({ message: 'No coordinator found for this department' });
    }

    res.status(200).json(coordinator);
  } catch (error) {
    console.error('Error fetching coordinator:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAllDepartmentsWithCoordinators = async (req, res) => {
  try {
    const { campusId } = req.query;

    let whereClause = {};
    if (campusId) {
      whereClause.CollegeCampusID = campusId;
    }

    const departments = await Department.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'Coordinator',
          attributes: ['UserID', 'FirstName', 'Surname']
        },
        {
          model: CollegeCampus,
          as: 'CollegeCampus',
          attributes: ['CollegeCampusID', 'Name']
        }
      ],
      attributes: ['DepartmentID', 'DepartmentName', 'CoordinatorID']
    });

    res.json(departments);
  } catch (error) {
    console.error('Error in getAllDepartmentsWithCoordinators:', error);
    res.status(500).json({ message: "Error retrieving departments with coordinators", error: error.message });
  }
};

exports.updateCoordinator = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userId } = req.body;

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let coordinator = await Coordinator.findOne({ where: { DepartmentID: departmentId } });
    if (coordinator) {
      await coordinator.update({ UserID: userId });
    } else {
      coordinator = await Coordinator.create({ DepartmentID: departmentId, UserID: userId });
    }

    await department.update({ CoordinatorID: coordinator.CoordinatorID });

    res.status(200).json({ message: 'Coordinator updated successfully', coordinator });
  } catch (error) {
    console.error('Error updating coordinator:', error);
    res.status(500).send('Internal Server Error');
  }
};
