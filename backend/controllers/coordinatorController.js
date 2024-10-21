const sequelize = require('../config/db.config');
const Coordinator = require('../models/coordinatorModel');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const CollegeCampus = require('../models/collegeCampusModel');

exports.assignCoordinator = async (req, res) => {
  try {
    const { departmentId, userId } = req.body;

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let coordinator = await Coordinator.findOne({ 
      include: [{ 
        model: Department, 
        as: 'Department', 
        where: { DepartmentID: departmentId } 
      }]
    });

    if (coordinator) {
      await coordinator.update({ UserID: userId });
    } else {
      coordinator = await Coordinator.create({ UserID: userId });
      await department.update({ CoordinatorID: coordinator.CoordinatorID });
    }

    const updatedCoordinator = await Coordinator.findOne({
      where: { CoordinatorID: coordinator.CoordinatorID },
      include: [
        { model: User, attributes: ['FirstName', 'Surname'] },
        { model: Department, as: 'Department' }
      ]
    });

    res.status(201).json(updatedCoordinator);
  } catch (error) {
    console.error('Error assigning coordinator:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
          model: Coordinator,
          as: 'Coordinator',
          include: [{
            model: User,
            attributes: ['FirstName', 'Surname']
          }]
        },
        {
          model: CollegeCampus,
          as: 'CollegeCampus',
          attributes: ['CollegeCampusID', 'Name']
        }
      ],
      attributes: ['DepartmentID', 'DepartmentName', 'CoordinatorID']
    });

    const simplifiedDepartments = departments.map(dept => ({
      DepartmentID: dept.DepartmentID,
      DepartmentName: dept.DepartmentName,
      CollegeCampus: dept.CollegeCampus ? {
        CollegeCampusID: dept.CollegeCampus.CollegeCampusID,
        Name: dept.CollegeCampus.Name
      } : null,
      Coordinator: dept.Coordinator ? {
        CoordinatorID: dept.Coordinator.CoordinatorID,
        UserID: dept.Coordinator.UserID,
        User: dept.Coordinator.User ? {
          FirstName: dept.Coordinator.User.FirstName,
          Surname: dept.Coordinator.User.Surname
        } : null
      } : null
    }));

    res.json(simplifiedDepartments);
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
