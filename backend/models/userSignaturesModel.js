const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const UserSignatures = sequelize.define('UserSignatures', {
  SignatureID: {
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
  SignatureImageURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SignatureDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'usersignatures',
  timestamps: false,
});

module.exports = UserSignatures;
