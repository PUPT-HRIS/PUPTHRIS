const User = require('./userModel');
const Department = require('./departmentModel');
const Coordinator = require('./coordinatorModel');
const CivilServiceEligibility = require('./CivilServiceEligibility');
const WorkExperience = require('./workexperienceModel');
const BasicDetails = require('./basicDetailsModel');
const AcademicRank = require('./academicRanksModel');
const CollegeCampus = require('./collegeCampusModel');
const Role = require('./roleModel');
const UserRole = require('./userRoleModel');

// CollegeCampus and User associations
CollegeCampus.hasMany(User, { foreignKey: 'CollegeCampusID', as: 'Users' });
User.belongsTo(CollegeCampus, { foreignKey: 'CollegeCampusID', as: 'CollegeCampus' });

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

// You might want to add an association between Department and CollegeCampus if needed
CollegeCampus.hasMany(Department, { foreignKey: 'CollegeCampusID', as: 'Departments' });
Department.belongsTo(CollegeCampus, { foreignKey: 'CollegeCampusID', as: 'CollegeCampus' });

User.belongsToMany(Role, { 
  through: UserRole,
  foreignKey: 'UserID',
  otherKey: 'RoleID',
  timestamps: false
});

Role.belongsToMany(User, { 
  through: UserRole,
  foreignKey: 'RoleID',
  otherKey: 'UserID',
  timestamps: false
});

module.exports = { 
    User, 
    Department, 
    Coordinator, 
    CivilServiceEligibility, 
    WorkExperience, 
    BasicDetails, 
    AcademicRank, 
    CollegeCampus 
};
