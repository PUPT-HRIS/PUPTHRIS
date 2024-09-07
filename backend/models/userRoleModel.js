// userRoleModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./userModel');
const Role = require('./roleModel');

const UserRole = sequelize.define('UserRole', {
  UserID: {
    type: DataTypes.INTEGER,
    references: {
      model: User, 
      key: 'UserID',
    },
    primaryKey: true,
  },
  RoleID: {
    type: DataTypes.INTEGER,
    references: {
      model: Role, 
      key: 'RoleID',
    },
    primaryKey: true,
  },
}, {
  tableName: 'user_roles',
  timestamps: false,
});

User.belongsToMany(Role, { through: UserRole, foreignKey: 'UserID' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'RoleID' });

module.exports = UserRole;
