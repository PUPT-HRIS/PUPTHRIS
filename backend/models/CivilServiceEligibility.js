const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const CivilServiceEligibility = sequelize.define('civilserviceeligibility', {
  CivilServiceEligibilityID: {
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
  CareerService: {
    type: DataTypes.STRING(100),
  },
  Rating: {
    type: DataTypes.STRING(10),
  },
  DateOfExamination: {
    type: DataTypes.DATE,
  },
  PlaceOfExamination: {
    type: DataTypes.STRING(100),
  },
  LicenseNumber: {
    type: DataTypes.STRING(50),
  },
  LicenseValidityDate: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'civilserviceeligibility',
  timestamps: false,
});

module.exports = CivilServiceEligibility;
