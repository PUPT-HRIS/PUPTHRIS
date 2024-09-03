const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Department = sequelize.define('Department', {
  DepartmentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  DepartmentName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Department Name cannot be null',
      },
      notEmpty: {
        msg: 'Department Name cannot be empty',
      },
    },
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'departments',
  timestamps: false,
});

module.exports = Department;
