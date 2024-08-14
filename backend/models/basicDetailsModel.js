const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const BasicDetails = sequelize.define('BasicDetails', {
  BasicDetailsID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  EmployeeNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  FacultyCode: {
    type: DataTypes.STRING(50),
  },
  Honorific: {
    type: DataTypes.STRING(20),
  },
  LastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  MiddleInitial: {
    type: DataTypes.STRING(10),
  },
  NameExtension: {
    type: DataTypes.STRING(10),
  },
  DateOfBirth: {
    type: DataTypes.DATE,
  },
  Sex: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
  },
  UserID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'UserID',
    },
    allowNull: false,
  },
}, {
  tableName: 'basicdetails',
  timestamps: false,
});

module.exports = BasicDetails;
