// userRoleModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const UserRole = sequelize.define('UserRole', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  RoleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: 'user_roles',
  timestamps: false,
});

module.exports = UserRole;
