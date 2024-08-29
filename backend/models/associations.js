const User = require('./userModel');
const Department = require('./departmentModel');

Department.hasMany(User, { foreignKey: 'DepartmentID', as: 'Users' });
User.belongsTo(Department, { foreignKey: 'DepartmentID', as: 'Department' });

module.exports = { User, Department };
