const ExcelJS = require('exceljs');
const path = require('path');

// Helper function to apply font and alignment settings to multiple cells
function setFontAndAlignmentForCells(cells, worksheet, fontSettings, alignmentSettings) {
    cells.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = fontSettings;
        cell.alignment = alignmentSettings;
    });
}

// Function to fill the Excel template with user data
async function fillExcelTemplate(userDetails, childrenDetails) {
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
    
     // Adding Children Details: I37 to I48 for names and M37 to M48 for birthdates
     const childrenNameCells = ['I37', 'I38', 'I39', 'I40', 'I41', 'I42', 'I43', 'I44', 'I45', 'I46', 'I47', 'I48'];
     const childrenBirthdateCells = ['M37', 'M38', 'M39', 'M40', 'M41', 'M42', 'M43', 'M44', 'M45', 'M46', 'M47', 'M48'];
     
     childrenDetails.slice(0, 12).forEach((child, index) => {
        worksheet.getCell(childrenNameCells[index]).value = child.ChildName || ''; // Child Name
        worksheet.getCell(childrenBirthdateCells[index]).value = child.BirthDate ? new Date(child.BirthDate).toISOString().split('T')[0] : ''; // Child Birthdate
    });

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
        'D45', 'D47', 'D48', 'D49', ...childrenNameCells, ...childrenBirthdateCells
    ], worksheet, arialFontSettings, centerAlignmentSettings);

    // Save the updated Excel file to a temporary path
    const tempExcelFilePath = path.join(__dirname, '../temp/filled_pds.xlsx');
    await workbook.xlsx.writeFile(tempExcelFilePath);

    return tempExcelFilePath;
}

module.exports = fillExcelTemplate;
