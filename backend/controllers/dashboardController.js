const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const BasicDetails = require('../models/basicDetailsModel');
const Department = require('../models/departmentModel');
const Role = require('../models/roleModel'); // New Role model
const UserRole = require('../models/userRoleModel'); // New UserRole model

exports.getDashboardData = async (req, res) => {
  try {
    // Count total females and males from BasicDetails
    const totalFemale = await BasicDetails.count({ where: { Sex: 'Female' } });
    const totalMale = await BasicDetails.count({ where: { Sex: 'Male' } });

    // Count employment types from User table
    const partTime = await User.count({ where: { EmploymentType: 'parttime' } });
    const fullTime = await User.count({ where: { EmploymentType: 'fulltime' } });
    const temporary = await User.count({ where: { EmploymentType: 'temporary' } });

    // Count users who are faculty
    const faculty = await User.count({
      include: [{
        model: Role,
        where: { RoleName: 'faculty' },
        through: { attributes: [] } // No need for UserRole attributes
      }]
    });

    // Count users who are staff
    const staff = await User.count({
      include: [{
        model: Role,
        where: { RoleName: 'staff' },
        through: { attributes: [] } // No need for UserRole attributes
      }]
    });

    // Get departments with count of users in each department
    const departments = await Department.findAll({
      include: [{
        model: User,
        as: 'Users',
        attributes: [],
      }],
      attributes: [
        'DepartmentName',
        [Sequelize.fn('COUNT', Sequelize.col('Users.DepartmentID')), 'count'],
      ],
      group: ['DepartmentName'],
      raw: true,
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
