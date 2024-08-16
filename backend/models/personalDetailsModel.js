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
  },
  CivilStatus: {
    type: DataTypes.ENUM('Single', 'Married', 'Widowed', 'Separated', 'Other'),
  },
  OtherCivilStatus: {
    type: DataTypes.STRING(50),
  },
  Height: {
    type: DataTypes.FLOAT,
  },
  Weight: {
    type: DataTypes.FLOAT,
  },
  BloodType: {
    type: DataTypes.STRING(5),
  },
  GSISNumber: {
    type: DataTypes.STRING(20),
  },
  PagIbigNumber: {
    type: DataTypes.STRING(20),
  },
  PhilHealthNumber: {
    type: DataTypes.STRING(20),
  },
  SSSNumber: {
    type: DataTypes.STRING(20),
  },
  TINNumber: {
    type: DataTypes.STRING(20),
  },
  AgencyEmployeeNumber: {
    type: DataTypes.STRING(20),
  },
  Citizenship: {
    type: DataTypes.STRING(50),
  },
  CitizenshipType: {
    type: DataTypes.ENUM('Filipino', 'Dual Citizenship'),
  },
  CitizenshipAcquisition: {
    type: DataTypes.ENUM('by birth', 'by naturalization'),
  },
  CitizenshipCountry: {
    type: DataTypes.STRING(50),
  },
  ResidentialHouseBlockLot: {
    type: DataTypes.STRING(100),
  },
  ResidentialStreet: {
    type: DataTypes.STRING(100),
  },
  ResidentialSubdivisionVillage: {
    type: DataTypes.STRING(100),
  },
  ResidentialBarangay: {
    type: DataTypes.STRING(100),
  },
  ResidentialCityMunicipality: {
    type: DataTypes.STRING(100),
  },
  ResidentialProvince: {
    type: DataTypes.STRING(100),
  },
  ResidentialZipCode: {
    type: DataTypes.STRING(10),
  },
  PermanentHouseBlockLot: {
    type: DataTypes.STRING(100),
  },
  PermanentStreet: {
    type: DataTypes.STRING(100),
  },
  PermanentSubdivisionVillage: {
    type: DataTypes.STRING(100),
  },
  PermanentBarangay: {
    type: DataTypes.STRING(100),
  },
  PermanentCityMunicipality: {
    type: DataTypes.STRING(100),
  },
  PermanentProvince: {
    type: DataTypes.STRING(100),
  },
  PermanentZipCode: {
    type: DataTypes.STRING(10),
  },
}, {
  tableName: 'personaldetails',
  timestamps: false,
});

module.exports = PersonalDetails;
