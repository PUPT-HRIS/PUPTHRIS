const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const secretKey = process.env.JWT_SECRET_KEY;

exports.login = async (req, res) => {
  const { fcode, password } = req.body;

  try {
    const user = await User.findOne({ where: { Fcode: fcode } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid fcode or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid fcode or password' });
    }

    const token = jwt.sign({ userId: user.UserID, role: user.Role }, secretKey, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
