const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const NonAcademic = sequelize.define('nonacademics', {
  NonAcademicID: {
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
  Distinction: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'nonacademics',
  timestamps: false,
});

module.exports = NonAcademic;
