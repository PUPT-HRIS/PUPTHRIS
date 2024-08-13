const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PersonalDetails = sequelize.define('PersonalDetails', {
  PersonalDetailsID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  LastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  MiddleName: {
    type: DataTypes.STRING(50),
  },
  NameExtension: {
    type: DataTypes.STRING(10),
  },
  BirthDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  PlaceOfBirth: {
    type: DataTypes.STRING(100),
  },
  Gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
  },
  CivilStatus: {
    type: DataTypes.STRING(20),
  },
  Height: {
    type: DataTypes.FLOAT,
  },
  Weight: {
    type: DataTypes.FLOAT,
  },
  BloodType: {
    type: DataTypes.STRING(5),
  },
  GSISNumber: {
    type: DataTypes.STRING(20),
  },
  PagIbigNumber: {
    type: DataTypes.STRING(20),
  },
  PhilHealthNumber: {
    type: DataTypes.STRING(20),
  },
  SSSNumber: {
    type: DataTypes.STRING(20),
  },
  TINNumber: {
    type: DataTypes.STRING(20),
  },
  AgencyEmployeeNumber: {
    type: DataTypes.STRING(20),
  },
  Citizenship: {
    type: DataTypes.STRING(50),
  },
  ResidentialAddress: {
    type: DataTypes.STRING(255),
  },
  PermanentAddress: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'personaldetails',
  timestamps: false,
});

module.exports = PersonalDetails;
