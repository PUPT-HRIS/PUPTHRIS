const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Children = sequelize.define('children', {
  ChildrenID: {
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
  ChildName: {
    type: DataTypes.STRING(100),
  },
  BirthDate: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'children',
  timestamps: false,
});

module.exports = Children;
