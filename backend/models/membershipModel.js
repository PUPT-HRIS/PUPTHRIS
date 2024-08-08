const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Membership = sequelize.define('memberships', {
  MembershipID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  EmployeeID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'employee',
      key: 'EmployeeID',
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
