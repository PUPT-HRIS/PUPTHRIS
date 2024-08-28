const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const AchievementAward = sequelize.define('AchievementAward', {
  AchievementID: {
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
  NatureOfAchievement: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Classification: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Level: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  AwardingBody: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Venue: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  InclusiveDates: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  SupportingDocument: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Proof: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'achievement_awards',
  timestamps: false,
});

module.exports = AchievementAward;
