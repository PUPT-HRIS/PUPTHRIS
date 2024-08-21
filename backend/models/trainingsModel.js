const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Trainings = sequelize.define('trainings_seminars', {
  TrainingID: {
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
    allowNull: false,
  },
  TrainingTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  DateFrom: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  DateTo: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ConductedBy: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'trainings_seminars',
  timestamps: false,
});

module.exports = Trainings;
