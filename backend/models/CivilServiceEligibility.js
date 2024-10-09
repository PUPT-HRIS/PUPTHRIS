const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const CivilServiceEligibility = sequelize.define('CivilServiceEligibility', {
  CivilServiceEligibilityID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CareerService: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Rating: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  DateOfExamination: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  PlaceOfExamination: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  LicenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  LicenseValidityDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'UserID'
    }
  },
}, {
  tableName: 'civilserviceeligibility',
  timestamps: false,
});

module.exports = CivilServiceEligibility;
