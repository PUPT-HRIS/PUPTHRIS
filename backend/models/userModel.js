// userModel.js
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
  EmploymentType: {
    type: DataTypes.ENUM('fulltime', 'parttime', 'temporary', 'designee'),
    allowNull: false,
  },
  DepartmentID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Department, 
      key: 'DepartmentID',
    },
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
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  CollegeCampusID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'collegecampuses',
      key: 'CollegeCampusID',
    },
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Add a method to toggle user active status
User.prototype.toggleActiveStatus = async function() {
  this.isActive = !this.isActive;
  return await this.save();
};

module.exports = User;
