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
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Classification: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Nature: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  SourceOfFund: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Organizer: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Level: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Venue: {
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
  NumberOfHours: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  SupportingDocuments: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Proof: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ProofType: {
    type: DataTypes.ENUM('file', 'link'),
    allowNull: false,
    defaultValue: 'file',
  },
}, {
  tableName: 'trainings_seminars',
  timestamps: false,
});

module.exports = Trainings;