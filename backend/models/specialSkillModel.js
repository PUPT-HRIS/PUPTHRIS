const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const SpecialSkill = sequelize.define('specialskills', {
  SpecialSkillsID: {
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
  Skill: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'specialskills',
  timestamps: false,
});

module.exports = SpecialSkill;
