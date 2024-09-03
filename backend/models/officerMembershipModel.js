const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const OfficershipMembership = sequelize.define('OfficershipMembership', {
  OfficershipMembershipID: {
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
  OrganizationName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  OrganizationAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Position: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Level: {
    type: DataTypes.ENUM('Local', 'National', 'International'),
    allowNull: true,
  },
  Classification: {
    type: DataTypes.ENUM(
      'Learning and Development Interventions',
      'Training Programs',
      'Seminars',
      'Conferences',
      'Others'
    ),
    allowNull: true,
  },
  InclusiveDatesFrom: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  InclusiveDatesTo: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  SupportingDocument: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Proof: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'officershipmembership',
  timestamps: false,
});

module.exports = OfficershipMembership;
