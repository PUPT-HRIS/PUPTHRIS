const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const WorkExperience = sequelize.define('workexperience', {
  WorkExperienceID: {
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
  InclusiveDatesFrom: {
    type: DataTypes.DATE,
  },
  InclusiveDatesTo: {
    type: DataTypes.DATE,
  },
  PositionTitle: {
    type: DataTypes.STRING(100),
  },
  DepartmentAgencyOfficeCompany: {
    type: DataTypes.STRING(100),
  },
  MonthlySalary: {
    type: DataTypes.DECIMAL(10, 2),
  },
  SalaryJobPayGrade: {
    type: DataTypes.STRING(20),
  },
  StatusOfAppointment: {
    type: DataTypes.STRING(50),
  },
  GovtService: {
    type: DataTypes.BOOLEAN,
  },
}, {
  tableName: 'workexperience',
  timestamps: false,
});

module.exports = WorkExperience;
