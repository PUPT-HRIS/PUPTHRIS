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
  NameExtension: {
    type: DataTypes.STRING(10),
  },
}, {
  tableName: 'basicdetails',
  timestamps: false,
});

module.exports = BasicDetails;
