const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ContactDetails = sequelize.define('ContactDetails', {
  ContactDetailsID: {
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
  TelephoneNumber: {
    type: DataTypes.STRING(20),
  },
  MobileNumber: {
    type: DataTypes.STRING(20),
  },
  EmailAddress: {
    type: DataTypes.STRING(100),
    references: {
      model: 'users',
      key: 'Email',
    },
  },
}, {
  tableName: 'contactdetails',
  timestamps: false,
});

module.exports = ContactDetails;
