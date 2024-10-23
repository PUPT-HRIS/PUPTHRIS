const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const { Department, CollegeCampus } = require('../models/associations');
const Role = require('../models/roleModel');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Add this constant at the top of your file
const ADMIN_ROLE_NAME = 'admin'; // Adjust this if your admin role has a different name

exports.addUser = async (req, res) => {
  try {
    const { Fcode, Surname, FirstName, MiddleName, NameExtension, Email, EmploymentType, Password, Roles, DepartmentID, CollegeCampusID } = req.body;
    
    // If DepartmentID is 'na' (Not Applicable), set it to null
    const finalDepartmentID = DepartmentID === 'na' ? null : DepartmentID;

    const salt = await bcrypt.genSalt(10);
    const PasswordHash = await bcrypt.hash(Password, salt);

    // Fetch the admin role
    const adminRole = await Role.findOne({ where: { RoleName: ADMIN_ROLE_NAME } });
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    // Determine the CollegeCampusID
    let finalCollegeCampusID = CollegeCampusID;
    if (!Roles.includes(adminRole.RoleID.toString())) {
      // If not an admin, use the CollegeCampusID from the request
      // This will be the current user's CollegeCampusID set by the frontend
      finalCollegeCampusID = CollegeCampusID;
    }

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
      CollegeCampusID: finalCollegeCampusID,
      isActive: true,
    });

    // Assign roles to the user
    if (Roles && Roles.length > 0) {
      const roles = await Role.findAll({ where: { RoleID: Roles } });
      await newUser.setRoles(roles, { through: { timestamps: false } });
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
    const { campusId } = req.query;

    let whereClause = { isActive: true };
    if (campusId) {
      whereClause.CollegeCampusID = campusId;
    }

    const users = await User.findAll({
      where: whereClause,
      include: [
        {
          model: Department,
          as: 'Department',
          attributes: ['DepartmentName']
        },
        {
          model: Role,
          as: 'Roles', 
          through: { attributes: [] },
          attributes: ['RoleName']
        },
        {
          model: CollegeCampus,
          as: 'CollegeCampus',
          attributes: ['Name']
        }
      ]
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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


exports.getCurrentUserCampus = async (req, res) => {
  console.log('getCurrentUserCampus controller method called');
  const userId = req.params.userId;
  console.log('User ID:', userId);
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: CollegeCampus, as: 'CollegeCampus' }]
    });
    if (!user || !user.CollegeCampus) {
      console.log('Campus not found for user');
      return res.status(404).json({ message: 'Campus not found for user' });
    }
    console.log('User campus found:', user.CollegeCampus);
    res.json(user.CollegeCampus);
  } catch (error) {
    console.error('Error in getCurrentUserCampus:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.updateUserCampus = async (req, res) => {
  try {
    const userId = req.user.UserID; // Assuming you have user info in the request
    const { campusId } = req.body;
    
    await User.update({ CollegeCampusID: campusId }, { where: { UserID: userId } });
    
    res.status(200).json({ message: 'Campus updated successfully' });
  } catch (error) {
    console.error('Error updating user campus:', error);
    res.status(500).send('Internal Server Error');
  }
};

