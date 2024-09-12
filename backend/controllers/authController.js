const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Department = require('../models/departmentModel'); 
const Role = require('../models/roleModel'); // Ensure Role is included
const UserRole = require('../models/userRoleModel'); // Ensure UserRole is included

const secretKey = process.env.JWT_SECRET_KEY;

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { Email: email },
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName'],
        },
        {
          model: Role, // Include roles
          through: { attributes: [] }, // No need for UserRole attributes
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Extract roles as an array of role names
    const roles = user.Roles.map(role => role.RoleName);

    // Add roles to token payload
    const token = jwt.sign({ userId: user.UserID, roles }, secretKey, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



