const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Add a new user
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

    // Send an email with the user's email, password, and link to the site
    await sendEmail(Email, Password, FirstName);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Assuming you're using Sequelize, adjust as per your ORM or database query method
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};

const sendEmail = async (toEmail, password, firstName) => {
  try {
    let transporter;

    if (['gmail', 'outlook', 'yahoo'].includes(process.env.EMAIL_SERVICE)) {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Custom SMTP server configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    const siteLink = process.env.SITE_LINK || 'https://yourwebsite.com';

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: toEmail, // list of receivers
      subject: 'Your Account Details',
      text: `Hello ${firstName},\n\nYour account has been created successfully!\n\nHere are your account details:\n\nEmail: ${toEmail}\nPassword: ${password}\n\nYou can log in using the following link:\n${siteLink}\n\nPlease change your password after your first login.\n\nBest regards,\nPUP Taguig Human Resources System`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
