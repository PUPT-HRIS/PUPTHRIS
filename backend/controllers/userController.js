const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.addUser = async (req, res) => {
  try {
    const { Fcode, Surname, FirstName, MiddleName, NameExtension, Email, EmploymentType, Password, Role, Department } = req.body;
    const salt = await bcrypt.genSalt(10);
    const PasswordHash = await bcrypt.hash(Password, salt);

    const newUser = await User.create({
      Fcode,
      Surname,
      FirstName,
      MiddleName,
      NameExtension,
      Email,
      EmploymentType,
      PasswordHash,
      Salt: salt,
      Role,
      Department,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['UserID', 'Fcode', 'FirstName', 'Surname', 'Role', 'Department', 'EmploymentType']
    });

    const usersWithFormattedNames = users.map(user => {
      const userData = user.toJSON();
      userData.Name = `${userData.FirstName} ${userData.Surname}`;
      userData.InstructorStatus = userData.Role; // Assuming Role represents instructor status
      delete userData.Role; // Remove Role to avoid confusion
      return userData;
    });

    res.status(200).json(usersWithFormattedNames);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};