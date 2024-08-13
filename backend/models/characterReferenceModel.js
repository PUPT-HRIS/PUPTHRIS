const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const CharacterReference = sequelize.define('CharacterReference', {
  ReferenceID: {
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
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING(255),
  },
  TelephoneNumber: {
    type: DataTypes.STRING(20),
  },
}, {
  tableName: 'characterreference',
  timestamps: false,
});

module.exports = CharacterReference;
