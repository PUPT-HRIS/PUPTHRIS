const fillExcelTemplate = require('../utils/fillExcelTemplate');
const libre = require('libreoffice-convert');
const fs = require('fs-extra');
const BasicDetails = require('../models/basicDetailsModel');
const PersonalDetails = require('../models/personalDetailsModel');
const ContactDetails = require('../models/contactDetailsModel'); 

// Function to generate PDS for the logged-in user
exports.generatePDS = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid userId from JWT' });
    }

    const basicDetails = await BasicDetails.findOne({ where: { UserID: userId } });
    const personalDetails = await PersonalDetails.findOne({ where: { UserID: userId } });
    const contactDetails = await ContactDetails.findOne({ where: { UserID: userId } });

    if (!basicDetails || !personalDetails || !contactDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    // Combine basicDetails and personalDetails into one object
    const userDetails = {
      ...basicDetails.get({ plain: true }),
      ...personalDetails.get({ plain: true }),
      ...contactDetails.get({ plain: true }),
    };

    // Use the utility function to fill the Excel template
    const tempExcelFilePath = await fillExcelTemplate(userDetails);

    // Convert Excel file to PDF using LibreOffice
    const pdfBuffer = await convertExcelToPDF(tempExcelFilePath);

    // Send the PDF to the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=pds_form.pdf');
    res.send(pdfBuffer);

    // Cleanup: Remove the temporary Excel file
    await fs.remove(tempExcelFilePath);
  } catch (error) {
    console.error('Error generating PDS:', error);
    res.status(500).send('Error generating PDS');
  }
};

// Function to generate PDS for another user
exports.generatePDSForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const basicDetails = await BasicDetails.findOne({ where: { UserID: userId } });
    const personalDetails = await PersonalDetails.findOne({ where: { UserID: userId } });
    const contactDetails = await ContactDetails.findOne({ where: { UserID: userId } });

    if (!basicDetails || !personalDetails || !contactDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    // Combine basicDetails and personalDetails into one object
    const userDetails = {
      ...basicDetails.get({ plain: true }),
      ...personalDetails.get({ plain: true }),
      ...contactDetails.get({ plain: true }),
    };

    // Use the utility function to fill the Excel template
    const tempExcelFilePath = await fillExcelTemplate(userDetails);

    // Convert Excel file to PDF using LibreOffice
    const pdfBuffer = await convertExcelToPDF(tempExcelFilePath);

    // Send the PDF to the client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=pds_form.pdf');
    res.send(pdfBuffer);

    // Cleanup: Remove the temporary Excel file
    await fs.remove(tempExcelFilePath);
  } catch (error) {
    console.error('Error generating PDS:', error);
    res.status(500).send('Error generating PDS');
  }
};

// Function to convert Excel file to PDF using LibreOffice
async function convertExcelToPDF(excelFilePath) {
  const buffer = await fs.readFile(excelFilePath);
  return new Promise((resolve, reject) => {
    libre.convert(buffer, '.pdf', undefined, (err, pdfBuffer) => {
      if (err) {
        return reject(err);
      }
      resolve(pdfBuffer);
    });
  });
}
