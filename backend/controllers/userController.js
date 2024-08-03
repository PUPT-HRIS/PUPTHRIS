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