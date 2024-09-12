// roleModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Role = sequelize.define('Role', {
  RoleID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  RoleName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // Roles like 'admin', 'superadmin', 'faculty' should be unique
  },
}, {
  tableName: 'roles',
  timestamps: false,
});

module.exports = Role;
