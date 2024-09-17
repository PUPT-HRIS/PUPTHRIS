const ExcelJS = require('exceljs');
const libre = require('libreoffice-convert');
const fs = require('fs-extra');
const path = require('path');
const BasicDetails = require('../models/basicDetailsModel');

exports.generatePDS = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid userId from JWT' });
    }

    const basicDetails = await BasicDetails.findOne({
      where: { UserID: userId },
    });

    if (!basicDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(__dirname, '../templates/pds_template.xlsx');
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    worksheet.getCell('D10').value = basicDetails.LastName;

    const tempExcelFilePath = path.join(__dirname, '../temp/filled_pds.xlsx');
    await workbook.xlsx.writeFile(tempExcelFilePath);

    const pdfBuffer = await convertExcelToPDF(tempExcelFilePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=pds_form.pdf');
    res.send(pdfBuffer);

    await fs.remove(tempExcelFilePath);
  } catch (error) {
    console.error('Error generating PDS:', error);
    res.status(500).send('Error generating PDS');
  }
};

exports.generatePDSForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const basicDetails = await BasicDetails.findOne({
      where: { UserID: userId },
    });

    if (!basicDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(__dirname, '../templates/pds_template.xlsx');
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    worksheet.getCell('D10').value = basicDetails.LastName;

    const tempExcelFilePath = path.join(__dirname, '../temp/filled_pds.xlsx');
    await workbook.xlsx.writeFile(tempExcelFilePath);

    const pdfBuffer = await convertExcelToPDF(tempExcelFilePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=pds_form.pdf');
    res.send(pdfBuffer);

    await fs.remove(tempExcelFilePath);
  } catch (error) {
    console.error('Error generating PDS:', error);
    res.status(500).send('Error generating PDS');
  }
};

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
