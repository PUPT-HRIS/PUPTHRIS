const ExcelJS = require('exceljs');
const path = require('path');

const { GetObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3.config');
const UserSignatures = require('../models/userSignaturesModel');
const { S3_BUCKET_NAME } = process.env;

// Helper function to apply font and alignment settings to multiple cells
function setFontAndAlignmentForCells(cells, worksheet, fontSettings, alignmentSettings) {
    cells.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = fontSettings;
        cell.alignment = alignmentSettings;
    });
}

async function getImageFromS3(imageURL) {
    const urlParts = new URL(imageURL);
    const fileName = urlParts.pathname.split('/').pop();

    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName
    };

    try {
        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        return await response.Body.transformToByteArray();
    } catch (err) {
        console.error('Error getting image from S3:', err);
        throw err;
    }
}


// Function to fill the Excel template with user data
async function fillExcelTemplate(userDetails, childrenDetails, educationDetails) {
    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(__dirname, '../templates/pds_template.xlsx');
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    // Fill basic details (left-aligned for these fields)
    worksheet.getCell('D10').value = ' ' + userDetails.LastName;  // Surname
    worksheet.getCell('D11').value = ' ' + userDetails.FirstName; // First Name
    worksheet.getCell('D12').value = ' ' + userDetails.MiddleInitial || ''; // Middle Name
    worksheet.getCell('L11').value = ' ' + userDetails.NameExtension || ''; // Name Extension

    // Format Date of Birth
    let dateOfBirth = userDetails.DateOfBirth;
    worksheet.getCell('D13').value = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';

    // Set Gender Checkbox
    const genderCell = worksheet.getCell('D16');
    if (userDetails.Sex === 'Male') {
        genderCell.value = '☑ Male                 ☐ Female';
    } else if (userDetails.Sex === 'Female') {
        genderCell.value = '☐ Male                 ☑ Female';
    } else {
        genderCell.value = '☐ Male                 ☐ Female';
    }

    // Add the new fields from Personal Details
    worksheet.getCell('D15').value = userDetails.PlaceOfBirth || ''; // Place of Birth
    worksheet.getCell('D22').value = userDetails.Height || ''; // Height
    worksheet.getCell('D24').value = userDetails.Weight || ''; // Weight
    worksheet.getCell('D25').value = userDetails.BloodType || ''; // Blood Type
    worksheet.getCell('D27').value = userDetails.GSISNumber || ''; // GSIS Number
    worksheet.getCell('D29').value = userDetails.PagIbigNumber || ''; // PagIbig Number
    worksheet.getCell('D31').value = userDetails.PhilHealthNumber || ''; // PhilHealth Number
    worksheet.getCell('D32').value = userDetails.SSSNumber || ''; // SSS Number
    worksheet.getCell('D33').value = userDetails.TINNumber || ''; // TIN Number
    worksheet.getCell('D34').value = userDetails.AgencyEmployeeNumber || ''; // Agency Employee Number

    // Set the content for Civil Status in D17 for the main options
    const civilStatusCell = worksheet.getCell('D17');
    civilStatusCell.value = '';

    // Manually set the value with line breaks for the Civil Status options
    let civilStatusValue = '';
    if (userDetails.CivilStatus === 'Single') {
        civilStatusValue = '☑ Single               ☐ Married\n';
    } else if (userDetails.CivilStatus === 'Married') {
        civilStatusValue = '☐ Single               ☑ Married\n';
    } else {
        civilStatusValue = '☐ Single               ☐ Married\n';
    }

    if (userDetails.CivilStatus === 'Widowed') {
        civilStatusValue += '☑ Widowed          ☐ Separated\n';
    } else if (userDetails.CivilStatus === 'Separated') {
        civilStatusValue += '☐ Widowed          ☑ Separated\n';
    } else {
        civilStatusValue += '☐ Widowed          ☐ Separated\n';
    }

    // Set this value in D17
    civilStatusCell.value = civilStatusValue;

    // Now move "Others" to D20
    const othersCell = worksheet.getCell('D20');
    othersCell.value = '☐ Other/s:';

    // Add Citizenship checkboxes with conditional logic
    const citizenshipFilipinoCell = worksheet.getCell('J13'); // For "Filipino" and "Dual Citizenship"
    let citizenshipValue = '';
    if (userDetails.CitizenshipType === 'Filipino') {
        citizenshipValue = '☑ Filipino               ☐ Dual Citizenship\n';
    } else if (userDetails.CitizenshipType === 'Dual Citizenship') {
        citizenshipValue = '☐ Filipino               ☑ Dual Citizenship\n';
    } else {
        citizenshipValue = '☐ Filipino               ☐ Dual Citizenship\n';
    }
    citizenshipFilipinoCell.value = citizenshipValue;

    worksheet.mergeCells('L14:N14');
    // Add "by birth" and "by naturalization" in L14 with left alignment and line breaks
    const citizenshipDualCell = worksheet.getCell('L14');
    let dualCitizenshipValue = '';
    if (userDetails.CitizenshipAcquisition === 'by birth') {
        dualCitizenshipValue = '☑ by birth             ☐ by naturalization';
    } else if (userDetails.CitizenshipAcquisition === 'by naturalization') {
        dualCitizenshipValue = '☐ by birth             ☑ by naturalization';
    } else {
        dualCitizenshipValue = '☐ by birth             ☐ by naturalization';
    }
    citizenshipDualCell.value = dualCitizenshipValue;

    // Add Citizenship Country
    worksheet.getCell('L16').value = userDetails.CitizenshipCountry || ''; // Citizenship Country

    // Add Residential Address fields
    worksheet.getCell('I17').value = userDetails.ResidentialHouseBlockLot || ''; // House Block Lot
    worksheet.getCell('L17').value = userDetails.ResidentialStreet || ''; // Street
    worksheet.getCell('I19').value = userDetails.ResidentialSubdivisionVillage || ''; // Subdivision Village
    worksheet.getCell('L19').value = userDetails.ResidentialBarangay || ''; // Barangay
    worksheet.getCell('I22').value = userDetails.ResidentialCityMunicipality || ''; // City/Municipality
    worksheet.getCell('L22').value = userDetails.ResidentialProvince || ''; // Province
    worksheet.getCell('I24').value = userDetails.ResidentialZipCode || ''; // Zip Code

    // Add Permanent Address fields
    worksheet.getCell('I25').value = userDetails.PermanentHouseBlockLot || ''; // House Block Lot
    worksheet.getCell('L25').value = userDetails.PermanentStreet || ''; // Street
    worksheet.getCell('I27').value = userDetails.PermanentSubdivisionVillage || ''; // Subdivision Village
    worksheet.getCell('L27').value = userDetails.PermanentBarangay || ''; // Barangay

    worksheet.getCell('J29').value = userDetails.PermanentCityMunicipality || ''; // City/Municipality
    worksheet.getCell('M29').value = userDetails.PermanentProvince || ''; // Province
    worksheet.getCell('I31').value = userDetails.PermanentZipCode || ''; // Zip Code

    worksheet.getCell('I32').value = userDetails.TelephoneNumber || '';  // Telephone Number (I32)
    worksheet.getCell('I33').value = userDetails.MobileNumber || '';     // Mobile Number (I33)
    worksheet.getCell('I34').value = userDetails.EmailAddress || '';

     // Spouse Details
    worksheet.getCell('D36').value = ' ' + (userDetails.SpouseLastName || '');   // Spouse Last Name
    worksheet.getCell('D37').value = ' ' + (userDetails.SpouseFirstName || '');  // Spouse First Name
    worksheet.getCell('D38').value = ' ' + (userDetails.SpouseMiddleName || ''); // Spouse Middle Name
    worksheet.getCell('D39').value = ' ' + (userDetails.SpouseOccupation || ''); // Spouse Occupation
    worksheet.getCell('D40').value = ' ' + (userDetails.SpouseEmployerName || ''); // Spouse Employer Name
    worksheet.getCell('D41').value = ' ' + (userDetails.SpouseBusinessAddress || ''); // Spouse Business Address
    worksheet.getCell('D42').value = ' ' + (userDetails.SpouseTelephoneNumber || ''); // Spouse Telephone Number

    // Father Details
    worksheet.getCell('D43').value = ' ' + (userDetails.FatherLastName || '');   // Father Last Name
    worksheet.getCell('D44').value = ' ' + (userDetails.FatherFirstName || '');  // Father First Name
    worksheet.getCell('D45').value = ' ' + (userDetails.FatherMiddleName || ''); // Father Middle Name

    // Mother Details
    worksheet.getCell('D47').value = ' ' + (userDetails.MotherLastName || '');   // Mother Last Name
    worksheet.getCell('D48').value = ' ' + (userDetails.MotherFirstName || '');  // Mother First Name
    worksheet.getCell('D49').value = ' ' + (userDetails.MotherMiddleName || '');
    worksheet.getCell('B56').value = 'VOCATIONAL / TRADE COURSE';
    
     // Adding Children Details: I37 to I48 for names and M37 to M48 for birthdates
     const childrenNameCells = ['I37', 'I38', 'I39', 'I40', 'I41', 'I42', 'I43', 'I44', 'I45', 'I46', 'I47', 'I48'];
     const childrenBirthdateCells = ['M37', 'M38', 'M39', 'M40', 'M41', 'M42', 'M43', 'M44', 'M45', 'M46', 'M47', 'M48'];

     childrenDetails.slice(0, 12).forEach((child, index) => {
        worksheet.getCell(childrenNameCells[index]).value = child.ChildName || ''; // Child Name
        worksheet.getCell(childrenBirthdateCells[index]).value = child.BirthDate ? new Date(child.BirthDate).toISOString().split('T')[0] : ''; // Child Birthdate
    });

    // Adding Education Details
    const educationLevelCells = {
        "ELEMENTARY": {name: 'D54', degree: 'G54', from: 'J54', to: 'K54', units: 'L54', graduated: 'M54', honors: 'N54'},
        "SECONDARY": {name: 'D55', degree: 'G55', from: 'J55', to: 'K55', units: 'L55', graduated: 'M55', honors: 'N55'},
        "VOCATIONAL / TRADE COURSE": {name: 'D56', degree: 'G56', from: 'J56', to: 'K56', units: 'L56', graduated: 'M56', honors: 'N56'},
        "COLLEGE": {name: 'D57', degree: 'G57', from: 'J57', to: 'K57', units: 'L57', graduated: 'M57', honors: 'N57'},
        "GRADUATE STUDIES": {name: 'D58', degree: 'G58', from: 'J58', to: 'K58', units: 'L58', graduated: 'M58', honors: 'N58'}
    };

    educationDetails.forEach(education => {
        let level = education.Level;

        // Group Master's and Doctorate under Graduate Studies for PDS
        if (level === "MASTER'S" || level === "DOCTORATE") {
            level = "GRADUATE STUDIES";
        }

        const cellPositions = educationLevelCells[level];

        if (cellPositions) {
            worksheet.getCell(cellPositions.name).value = education.NameOfSchool || '';
            worksheet.getCell(cellPositions.degree).value = education.BasicEducationDegreeCourse || '';
            worksheet.getCell(cellPositions.from).value = education.PeriodOfAttendanceFrom ? new Date(education.PeriodOfAttendanceFrom).toISOString().split('T')[0] : '';
            worksheet.getCell(cellPositions.to).value = education.PeriodOfAttendanceTo ? new Date(education.PeriodOfAttendanceTo).toISOString().split('T')[0] : '';
            worksheet.getCell(cellPositions.units).value = education.HighestLevelUnitsEarned || '';
            worksheet.getCell(cellPositions.graduated).value = education.YearGraduated || '';
            worksheet.getCell(cellPositions.honors).value = education.AcademicHonors || '';
        }
    });

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format it as YYYY-MM-DD

    worksheet.getCell('L60').value = formattedDate;

    // Fetch user signature
    try {
        const userSignature = await UserSignatures.findOne({ where: { UserID: userDetails.UserID } });
        if (userSignature && userSignature.SignatureImageURL) {
            const imageBuffer = await getImageFromS3(userSignature.SignatureImageURL);
            const fileExtension = userSignature.SignatureImageURL.split('.').pop().toLowerCase();
            
            let extension;
            switch (fileExtension) {
                case 'jpg':
                case 'jpeg':
                    extension = 'jpeg';
                    break;
                case 'png':
                    extension = 'png';
                    break;
                default:
                    throw new Error('Unsupported image format');
            }

            const imageId = workbook.addImage({
                buffer: imageBuffer,
                extension: extension,
            });

            worksheet.addImage(imageId, {
                tl: { col: 3, row: 59 },  // D60
                br: { col: 4, row: 60 },  // E61
                editAs: 'oneCell'
            });

            worksheet.getRow(60).height = 60; // Adjust signature row height
        }
    } catch (error) {
        console.error('Error adding signature image:', error);
    }

    // Set Arial font settings
    const arialFontSettings = { name: 'Arial', size: 10 };

    // Left alignment for the Civil Status options (specifically)
    civilStatusCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };

    // Left alignment for the "Others" field
    othersCell.alignment = { horizontal: 'left', vertical: 'middle' };

    // Left alignment for "by birth" and "by naturalization" options
    citizenshipDualCell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };

    // Center alignment settings for the cells you want to center
    const centerAlignmentSettings = { horizontal: 'center', vertical: 'middle' };

    // Left alignment settings for the cells you want to left-align
    const leftAlignmentSettings = { horizontal: 'left', vertical: 'middle' };

    // Apply the font and left alignment to these specific cells
    setFontAndAlignmentForCells(['D10', 'D11', 'D12', 'L11'], worksheet, arialFontSettings, leftAlignmentSettings);

    // Apply the font and center alignment to other relevant cells except civil status and citizenship options
    setFontAndAlignmentForCells([
        'D13', 'D15', 'D22', 'D24', 'D25', 'D27', 'D29', 'D31', 'D32', 'D33', 'D34', 'D16',
        'I17', 'L17', 'I19', 'L19', 'I22', 'L22', 'I24', 'I25', 'L25', 'I27', 'L27', 'I29', 'K29',
        'I31', 'I32', 'I33', 'I34', 'D36', 'D37', 'D38', 'D39', 'D40', 'D41', 'D42', 'D43', 'D44', 
        'D45', 'D47', 'D48', 'D49', ...childrenNameCells, ...childrenBirthdateCells, 'L60'
    ], worksheet, arialFontSettings, centerAlignmentSettings);

    // Save the updated Excel file to a temporary path
    const tempExcelFilePath = path.join(__dirname, '../temp/filled_pds.xlsx');
    await workbook.xlsx.writeFile(tempExcelFilePath);

    return tempExcelFilePath;
}

module.exports = fillExcelTemplate;
