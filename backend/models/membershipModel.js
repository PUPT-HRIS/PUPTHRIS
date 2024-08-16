const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Membership = sequelize.define('memberships', {
  MembershipID: {
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
  },
  Association: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'memberships',
  timestamps: false,
});

module.exports = Membership;
