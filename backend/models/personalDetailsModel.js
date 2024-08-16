const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PersonalDetails = sequelize.define('PersonalDetails', {
  PersonalDetailsID: {
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
  PlaceOfBirth: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  CivilStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  Height: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  BloodType: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  GSISNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  PagIbigNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  PhilHealthNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  SSSNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  TINNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  AgencyEmployeeNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  Citizenship: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ResidentialHouseBlockLot: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ResidentialStreet: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ResidentialSubdivisionVillage: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ResidentialBarangay: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ResidentialCityMunicipality: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ResidentialProvince: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PermanentHouseBlockLot: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PermanentStreet: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PermanentSubdivisionVillage: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PermanentBarangay: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PermanentCityMunicipality: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PermanentProvince: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'personaldetails',
  timestamps: false,
});

module.exports = PersonalDetails;
