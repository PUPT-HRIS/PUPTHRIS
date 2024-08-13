const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const AdditionalQuestion = sequelize.define('AdditionalQuestion', {
  ResponseID: {
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
  Q34a: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q34a_Details: {
    type: DataTypes.STRING(255),
  },
  Q34b: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q34b_Details: {
    type: DataTypes.STRING(255),
  },
  Q35a: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q35a_Details: {
    type: DataTypes.STRING(255),
  },
  Q35b: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q35b_Details: {
    type: DataTypes.STRING(255),
  },
  Q35b_DateFiled: {
    type: DataTypes.DATE,
  },
  Q35b_Status: {
    type: DataTypes.STRING(255),
  },
  Q36: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q36_Details: {
    type: DataTypes.STRING(255),
  },
  Q37a: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q37a_Details: {
    type: DataTypes.STRING(255),
  },
  Q37b: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q37b_Details: {
    type: DataTypes.STRING(255),
  },
  Q37c: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q37c_Details: {
    type: DataTypes.STRING(255),
  },
  Q38: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q38_Details: {
    type: DataTypes.STRING(255),
  },
  Q39a: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q39a_Details: {
    type: DataTypes.STRING(255),
  },
  Q39b: {
    type: DataTypes.ENUM('Yes', 'No'),
    allowNull: false,
  },
  Q39b_Details: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'additionalquestion',
  timestamps: false,
});

module.exports = AdditionalQuestion;
