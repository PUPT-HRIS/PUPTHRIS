const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const { Department } = require('../models/associations');
require('dotenv').config();

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.SITE_LINK}/reset-password?token=${token}`;

    await sendResetEmail(user.Email, resetLink, user.FirstName);

    res.status(200).json({ message: 'Password reset link sent successfully.' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).send('Internal Server Error');
  }
};

const sendResetEmail = async (toEmail, resetLink, firstName) => {
  try {
    let transporter;

    if (['gmail', 'outlook', 'yahoo', 'iskolarngbayan.pup.edu.ph'].includes(process.env.EMAIL_SERVICE)) {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: toEmail,
      subject: 'Password Reset Request',
      text: `Hello ${firstName},\n\nYou requested a password reset. Please use the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nPUP Taguig Human Resources System`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to', toEmail);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
