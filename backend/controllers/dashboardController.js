const { Sequelize, Op } = require('sequelize');
const User = require('../models/userModel');
const BasicDetails = require('../models/basicDetailsModel');
const Department = require('../models/departmentModel');
const Role = require('../models/roleModel'); // New Role model
const UserRole = require('../models/userRoleModel');
const AcademicRank = require('../models/academicRanksModel');
const Training = require('../models/trainingsModel');
const AchievementAward = require('../models/achievementAwardsModel');
const VoluntaryWork = require('../models/voluntaryworkModel');
const OfficerMembership = require('../models/officerMembershipModel');
const moment = require('moment');

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

exports.getUserDashboardData = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userData = await User.findOne({
      where: { UserID: userId },
      attributes: ['EmploymentType'],
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName'],
        },
        {
          model: AcademicRank,
          attributes: ['Rank'],
        }
      ]
    });

    if (!userData) {
      return res.status(404).json({ message: 'User data not found' });
    }

    // Fetch counts for each category
    const trainingCount = await Training.count({ where: { UserID: userId } });
    const awardCount = await AchievementAward.count({ where: { UserID: userId } });
    const voluntaryWorkCount = await VoluntaryWork.count({ where: { userID: userId } });
    const membershipCount = await OfficerMembership.count({ where: { userID: userId } });

    const userDashboardData = {
      department: userData.Department ? userData.Department.DepartmentName : 'N/A',
      academicRank: userData.AcademicRank ? userData.AcademicRank.Rank : 'N/A',
      employmentType: userData.EmploymentType || 'N/A',
      activityCounts: {
        trainings: trainingCount,
        awards: awardCount,
        voluntaryActivities: voluntaryWorkCount,
        professionalMemberships: membershipCount
      }
    };

    res.status(200).json(userDashboardData);
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    res.status(500).json({ message: 'Error fetching user dashboard data', error: error.message });
  }
};

exports.getUpcomingBirthdays = async (req, res) => {
  try {
    const today = moment();
    const start = today.startOf('day');
    const end = today.clone().add(7, 'days').endOf('day');

    console.log('Start Date:', start.format('YYYY-MM-DD'));
    console.log('End Date:', end.format('YYYY-MM-DD'));

    const upcomingBirthdays = await BasicDetails.findAll({
      where: Sequelize.where(
        Sequelize.fn('CONCAT',
          Sequelize.fn('MONTH', Sequelize.col('DateOfBirth')),
          '-',
          Sequelize.fn('DAY', Sequelize.col('DateOfBirth'))
        ),
        {
          [Op.between]: [
            `${start.month() + 1}-${start.date()}`,
            `${end.month() + 1}-${end.date()}`
          ]
        }
      ),
      include: [{
        model: User,
        where: { isActive: true },
        attributes: ['UserID']
      }],
      attributes: ['FirstName', 'LastName', 'DateOfBirth'],
      order: [['DateOfBirth', 'ASC']]
    });

    console.log('Upcoming Birthdays:', upcomingBirthdays);

    res.status(200).json(upcomingBirthdays);
  } catch (error) {
    console.error('Error fetching upcoming birthdays:', error);
    res.status(500).json({ message: 'Error fetching upcoming birthdays', error: error.message });
  }
};

exports.getAgeGroupData = async (req, res) => {
  try {
    const { campusId } = req.query;

    const ageGroups = await BasicDetails.findAll({
      attributes: [
        [Sequelize.literal(`
          CASE
            WHEN DATEDIFF(CURDATE(), DateOfBirth) / 365 < 25 THEN '18-24'
            WHEN DATEDIFF(CURDATE(), DateOfBirth) / 365 BETWEEN 25 AND 34 THEN '25-34'
            WHEN DATEDIFF(CURDATE(), DateOfBirth) / 365 BETWEEN 35 AND 44 THEN '35-44'
            WHEN DATEDIFF(CURDATE(), DateOfBirth) / 365 BETWEEN 45 AND 54 THEN '45-54'
            ELSE '55+'
          END
        `), 'ageGroup'],
        [Sequelize.fn('COUNT', Sequelize.col('BasicDetailsID')), 'count']
      ],
      include: [{
        model: User,
        where: {
          isActive: true,
          ...(campusId && { CollegeCampusID: campusId })
        },
        attributes: []
      }],
      group: ['ageGroup'],
      order: [[Sequelize.literal('ageGroup'), 'ASC']]
    });

    res.status(200).json(ageGroups);
  } catch (error) {
    console.error('Error fetching age group data:', error);
    res.status(500).json({ message: 'Error fetching age group data', error: error.message });
  }
};
