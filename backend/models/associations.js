const User = require('./userModel');
const Department = require('./departmentModel');
const Coordinator = require('./coordinatorModel');
const CivilServiceEligibility = require('./CivilServiceEligibility');
const WorkExperience = require('./workexperienceModel');
const BasicDetails = require('./basicDetailsModel');
const AcademicRank = require('./academicRanksModel');
// User and Department associations
Department.hasMany(User, { foreignKey: 'DepartmentID', as: 'Users' });
User.belongsTo(Department, { foreignKey: 'DepartmentID', as: 'Department' });

// Coordinator associations
Department.belongsTo(Coordinator, { 
    foreignKey: 'CoordinatorID', 
    as: 'Coordinator',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

Coordinator.belongsTo(User, { foreignKey: 'UserID' });
Coordinator.belongsTo(Department, { foreignKey: 'DepartmentID' });
User.hasMany(Coordinator, { foreignKey: 'UserID' });
Department.hasMany(Coordinator, { foreignKey: 'DepartmentID' });

// Civil Service Eligibility associations
User.hasMany(CivilServiceEligibility, { foreignKey: 'userID' });
CivilServiceEligibility.belongsTo(User, { foreignKey: 'userID' });

// Work Experience associations
User.hasMany(WorkExperience, { foreignKey: 'userID' });
WorkExperience.belongsTo(User, { foreignKey: 'userID' });

User.hasOne(BasicDetails, { foreignKey: 'UserID' });
BasicDetails.belongsTo(User, { foreignKey: 'UserID' });

User.hasOne(AcademicRank, { foreignKey: 'UserID' });
AcademicRank.belongsTo(User, { foreignKey: 'UserID' });


module.exports = { User, Department, Coordinator, CivilServiceEligibility, WorkExperience };
