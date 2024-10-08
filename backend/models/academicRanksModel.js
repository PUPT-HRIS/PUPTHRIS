const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./userModel');

const AcademicRank = sequelize.define('AcademicRank', {
  AcademicRankID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Ensure only one rank per user
    references: {
      model: User,
      key: 'UserID',
    },
  },
  Rank: {
    type: DataTypes.ENUM(
      'Instructor 1', 'Instructor 2', 'Instructor 3',
      'Assistant Professor 1', 'Assistant Professor 2', 'Assistant Professor 3', 'Assistant Professor 4',
      'Associate Professor 1', 'Associate Professor 2', 'Associate Professor 3', 'Associate Professor 4', 'Associate Professor 5',
      'Professor 1', 'Professor 2', 'Professor 3', 'Professor 4', 'Professor 5', 'Professor 6'
    ),
    allowNull: false,
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'academicranks',
  timestamps: true,
  updatedAt: 'UpdatedAt',
  createdAt: false, // We don't need CreatedAt since we're only tracking the current rank
});

module.exports = AcademicRank;