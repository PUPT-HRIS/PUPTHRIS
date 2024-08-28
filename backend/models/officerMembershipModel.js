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
  },
  Position: {
    type: DataTypes.STRING(255),
  },
  Level: {
    type: DataTypes.STRING(255),
  },
  Classification: {
    type: DataTypes.STRING(255),
  },
  InclusiveDatesFrom: {
    type: DataTypes.DATE,
  },
  InclusiveDatesTo: {
    type: DataTypes.DATE,
  },
  CurrentOfficer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  Remarks: {
    type: DataTypes.STRING(500),
  },
  SupportingDocument: {
    type: DataTypes.STRING(255),
  },
  DescriptionSupportingDocument: {
    type: DataTypes.STRING(255),
  },
  Proof: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'officershipmembership',
  timestamps: false,
});

module.exports = OfficershipMembership;
