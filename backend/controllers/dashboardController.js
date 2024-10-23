const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const BasicDetails = require('../models/basicDetailsModel');
const Department = require('../models/departmentModel');
const Role = require('../models/roleModel'); // New Role model
const UserRole = require('../models/userRoleModel'); // New UserRole model

exports.getDashboardData = async (req, res) => {
  try {
    const { campusId } = req.query;

    // Base where clause for active users
    let userWhereClause = { isActive: true };
    
    // Add campusId to the where clause if provided
    if (campusId) {
      userWhereClause.CollegeCampusID = campusId;
    }

    // Count total females and males from BasicDetails
    const totalFemale = await BasicDetails.count({
      where: { Sex: 'Female' },
      include: [{
        model: User,
        where: userWhereClause,
        attributes: []
      }]
    });

    const totalMale = await BasicDetails.count({
      where: { Sex: 'Male' },
      include: [{
        model: User,
        where: userWhereClause,
        attributes: []
      }]
    });

    // Count employment types from User table
    const partTime = await User.count({ where: { ...userWhereClause, EmploymentType: 'parttime' } });
    const fullTime = await User.count({ where: { ...userWhereClause, EmploymentType: 'fulltime' } });
    const temporary = await User.count({ where: { ...userWhereClause, EmploymentType: 'temporary' } });

    // Count users who are faculty
    const faculty = await User.count({
      where: userWhereClause,
      include: [{
        model: Role,
        where: { RoleName: 'faculty' },
        through: { attributes: [] }
      }]
    });

    // Count users who are staff
    const staff = await User.count({
      where: userWhereClause,
      include: [{
        model: Role,
        where: { RoleName: 'staff' },
        through: { attributes: [] }
      }]
    });

    // Get departments with count of users in each department
    const departments = await Department.findAll({
      where: campusId ? { CollegeCampusID: campusId } : {},
      attributes: [
        'DepartmentID',
        'DepartmentName',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM users
          WHERE 
            users.DepartmentID = Department.DepartmentID
            AND users.isActive = true
            ${campusId ? 'AND users.CollegeCampusID = :campusId' : ''}
        )`), 'count']
      ],
      replacements: campusId ? { campusId } : {},
      group: ['Department.DepartmentID', 'Department.DepartmentName'],
      raw: true,
      order: [['DepartmentName', 'ASC']]
    });

    res.status(200).json({
      totalFemale,
      totalMale,
      partTime,
      fullTime,
      temporary,
      faculty,
      staff,
      departments,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};
