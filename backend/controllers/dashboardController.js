const { Sequelize } = require('sequelize');
const User = require('../models/userModel');
const BasicDetails = require('../models/basicDetailsModel');
const Department = require('../models/departmentModel');

exports.getDashboardData = async (req, res) => {
  try {
    const totalFemale = await BasicDetails.count({ where: { Sex: 'Female' } });
    const totalMale = await BasicDetails.count({ where: { Sex: 'Male' } });
    const partTime = await User.count({ where: { EmploymentType: 'parttime' } });
    const fullTime = await User.count({ where: { EmploymentType: 'fulltime' } });
    const temporary = await User.count({ where: { EmploymentType: 'temporary' } });
    const faculty = await User.count({ where: { Role: 'faculty' } });
    const staff = await User.count({ where: { Role: 'staff' } });

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

