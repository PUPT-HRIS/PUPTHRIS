const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const LearningDevelopment = sequelize.define('learningdevelopment', {
  LearningDevelopmentID: {
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
  TitleOfLearningDevelopment: {
    type: DataTypes.STRING(100),
  },
  InclusiveDatesFrom: {
    type: DataTypes.DATE,
  },
  InclusiveDatesTo: {
    type: DataTypes.DATE,
  },
  NumberOfHours: {
    type: DataTypes.INTEGER,
  },
  TypeOfLD: {
    type: DataTypes.STRING(50),
  },
  ConductedSponsoredBy: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'learningdevelopment',
  timestamps: false,
});

module.exports = LearningDevelopment;
