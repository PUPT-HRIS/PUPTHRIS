const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Department = require('./departmentModel');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Fcode: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Salt: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('faculty', 'staff', 'admin'),
    defaultValue: 'staff',
  },
  EmploymentType: {
    type: DataTypes.ENUM('fulltime', 'parttime', 'temporary'),
    allowNull: false,
  },
  DepartmentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: 'DepartmentID',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  Surname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  MiddleName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  NameExtension: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
