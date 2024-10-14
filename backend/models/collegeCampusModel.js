const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const CollegeCampus = sequelize.define('CollegeCampus', {
  CollegeCampusID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'collegecampuses',
  timestamps: false
});

module.exports = CollegeCampus;