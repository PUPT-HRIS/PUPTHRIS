const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const OtherInformation = sequelize.define('otherinformation', {
  OtherInformationID: {
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
  SpecialSkillsHobbies: {
    type: DataTypes.STRING(255),
  },
  NonAcademicDistinctions: {
    type: DataTypes.STRING(255),
  },
  MembershipInAssociation: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'otherinformation',
  timestamps: false,
});

module.exports = OtherInformation;
