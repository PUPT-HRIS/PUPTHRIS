const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const WorkExperience = sequelize.define('WorkExperience', {
  WorkExperienceID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'UserID'
    }
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
