const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Education = sequelize.define('Education', {
  EducationID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  Level: {
    type: DataTypes.STRING(50),
  },
  NameOfSchool: {
    type: DataTypes.STRING(100),
  },
  BasicEducationDegreeCourse: {
    type: DataTypes.STRING(100),
  },
  PeriodOfAttendanceFrom: {
    type: DataTypes.DATE,
  },
  PeriodOfAttendanceTo: {
    type: DataTypes.DATE,
  },
  HighestLevelUnitsEarned: {
    type: DataTypes.STRING(50),
  },
  YearGraduated: {
    type: DataTypes.STRING(4),
  },
  AcademicHonors: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'education',
  timestamps: false,
});

module.exports = Education;
