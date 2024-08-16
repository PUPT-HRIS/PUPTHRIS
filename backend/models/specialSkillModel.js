const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const SpecialSkill = sequelize.define('specialskills', {
  SpecialSkillsID: {
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
  Skill: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'specialskills',
  timestamps: false,
});

module.exports = SpecialSkill;
