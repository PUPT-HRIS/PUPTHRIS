const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Coordinator = sequelize.define('Coordinator', {
  CoordinatorID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID'
    }
  },
  DepartmentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'DepartmentID'
    }
  }
}, {
  tableName: 'coordinators',
  timestamps: false
});

module.exports = Coordinator;
