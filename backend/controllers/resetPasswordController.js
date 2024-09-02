const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // Import Op from Sequelize
const User = require('../models/userModel');

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Get token from URL parameters
    const { newPassword } = req.body; // Get new password from request body

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: Date.now(), // Check if token is not expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.PasswordHash = await bcrypt.hash(newPassword, salt);
    user.Salt = salt;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
};
