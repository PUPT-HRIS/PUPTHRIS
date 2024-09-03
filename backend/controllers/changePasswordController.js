const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.changePassword = async (req, res) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
 
    console.log("Request Body:", req.body);
    console.log("Extracted UserId:", userId);

    try {
      const user = await User.findByPk(userId);
 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
 
      const isPasswordValid = await bcrypt.compare(currentPassword, user.PasswordHash);
 
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
 
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
 
      user.PasswordHash = newHashedPassword;
      user.Salt = salt;
 
      await user.save();
 
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
