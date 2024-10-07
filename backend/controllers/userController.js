const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const { Department } = require('../models/associations');
const Role = require('../models/roleModel'); // Add this line
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.addUser = async (req, res) => {
  try {
    const { Fcode, Surname, FirstName, MiddleName, NameExtension, Email, EmploymentType, Password, Roles, DepartmentID } = req.body;
    
    // If DepartmentID is 'na' (Not Applicable), set it to null
    const finalDepartmentID = DepartmentID === 'na' ? null : DepartmentID;

    const salt = await bcrypt.genSalt(10);
    const PasswordHash = await bcrypt.hash(Password, salt);

    // Create a new user
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
      DepartmentID: finalDepartmentID,
      isActive: true, // Explicitly set isActive to true (optional due to default value)
    });

    // Assign roles to the user
    if (Roles && Roles.length > 0) {
      const roles = await Role.findAll({ where: { RoleID: Roles } }); // Find selected roles by ID
      await newUser.setRoles(roles); // Associate roles with the user
    }

    await sendEmail(Email, Password, FirstName);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isActive: true }, // Add this line to filter active users
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName']
        },
        {
          model: Role, // Include the roles in the response
          as: 'Roles', 
          through: { attributes: [] }, // Include roles without join table attributes
          attributes: ['RoleName']
        }
      ]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName']
        },
        {
          model: Role, // Include the roles in the response
          as: 'Roles', 
          through: { attributes: [] }, // Exclude the join table attributes
          attributes: ['RoleName'], // Only fetch the role names
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
};

const sendEmail = async (toEmail, password, firstName) => {
  try {
    let transporter;

    if (['gmail', 'outlook', 'yahoo', 'iskolarngbayan.pup.edu.ph'].includes(process.env.EMAIL_SERVICE)) {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD, // App-specific password if using Gmail
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

    const siteLink = process.env.SITE_LINK || 'https://pup-hris.site';

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: toEmail,
      subject: 'Your Account Details',
      text: `Hello ${firstName},\n\nYour account has been created successfully!\n\nHere are your account details:\n\nEmail: ${toEmail}\nPassword: ${password}\n\nYou can log in using the following link:\n${siteLink}\n\nPlease change your password after your first login.\n\nBest regards,\nPUP Taguig Human Resources System`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Add a new function to toggle user active status
exports.toggleUserActiveStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.toggleActiveStatus();
    res.status(200).json({ message: 'User status updated', isActive: user.isActive });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).send('Internal Server Error');
  }
};
