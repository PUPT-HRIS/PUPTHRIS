const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const FamilyBackground = sequelize.define('familybackground', {
  FamilyBackgroundID: {
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
  SpouseLastName: {
    type: DataTypes.STRING(50),
  },
  SpouseFirstName: {
    type: DataTypes.STRING(50),
  },
  SpouseMiddleName: {
    type: DataTypes.STRING(50),
  },
  SpouseOccupation: {
    type: DataTypes.STRING(100),
  },
  SpouseEmployerName: {
    type: DataTypes.STRING(100),
  },
  SpouseBusinessAddress: {
    type: DataTypes.STRING(255),
  },
  SpouseTelephoneNumber: {
    type: DataTypes.STRING(20),
  },
  FatherLastName: {
    type: DataTypes.STRING(50),
  },
  FatherFirstName: {
    type: DataTypes.STRING(50),
  },
  FatherMiddleName: {
    type: DataTypes.STRING(50),
  },
  MotherLastName: {
    type: DataTypes.STRING(50),
  },
  MotherFirstName: {
    type: DataTypes.STRING(50),
  },
  MotherMiddleName: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'familybackground',
  timestamps: false,
});

module.exports = FamilyBackground;
