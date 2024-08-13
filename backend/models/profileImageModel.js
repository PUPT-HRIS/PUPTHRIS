const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ProfileImage = sequelize.define('ProfileImage', {
  ImageID: {
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
  ImagePath: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  UploadedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'profileimage',
  timestamps: false,
});

module.exports = ProfileImage;
