async function fillWorksheet2(workbook, userDetails, civilServiceEligibilities, workExperiences) {
    const worksheet = workbook.getWorksheet(2);

    // Define the cell ranges for each field
    const ranges = {
        careerService: ['A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11'],
        rating: ['F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'],
        dateOfExamination: ['G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11'],
        placeOfExamination: ['I5', 'I6', 'I7', 'I8', 'I9', 'I10', 'I11'],
        licenseNumber: ['L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11'],
        licenseValidityDate: ['M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11']
    };

    // Fill in the civil service eligibility information
    civilServiceEligibilities.slice(0, 7).forEach((eligibility, index) => {
        worksheet.getCell(ranges.careerService[index]).value = eligibility.CareerService || '';
        worksheet.getCell(ranges.rating[index]).value = eligibility.Rating || '';
        worksheet.getCell(ranges.dateOfExamination[index]).value = eligibility.DateOfExamination ? new Date(eligibility.DateOfExamination) : '';
        worksheet.getCell(ranges.placeOfExamination[index]).value = eligibility.PlaceOfExamination || '';
        worksheet.getCell(ranges.licenseNumber[index]).value = eligibility.LicenseNumber || '';
        worksheet.getCell(ranges.licenseValidityDate[index]).value = eligibility.LicenseValidityDate ? new Date(eligibility.LicenseValidityDate) : '';
    });

    fillWorkExperience(worksheet, workExperiences);

    // Set font and alignment for all filled cells
    const cellsToFormat = [
        ...ranges.careerService,
        ...ranges.rating,
        ...ranges.dateOfExamination,
        ...ranges.placeOfExamination,
        ...ranges.licenseNumber,
        ...ranges.licenseValidityDate
    ];

    cellsToFormat.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
}


function fillWorkExperience(worksheet, workExperiences) {
    const startRow = 18;
    const endRow = 45;
    const columns = {
        inclusiveDatesFrom: 'A',
        inclusiveDatesTo: 'C',
        positionTitle: 'D',
        departmentAgencyOfficeCompany: 'G',
        monthlySalary: 'J',
        salaryJobPayGrade: 'K',
        statusOfAppointment: 'L',
        govtService: 'M'
    };

    workExperiences.slice(0, endRow - startRow + 1).forEach((experience, index) => {
        const row = startRow + index;

        worksheet.getCell(`${columns.inclusiveDatesFrom}${row}`).value = experience.InclusiveDatesFrom ? new Date(experience.InclusiveDatesFrom) : '';
        worksheet.getCell(`${columns.inclusiveDatesTo}${row}`).value = experience.InclusiveDatesTo ? new Date(experience.InclusiveDatesTo) : '';
        worksheet.getCell(`${columns.positionTitle}${row}`).value = experience.PositionTitle || '';
        worksheet.getCell(`${columns.departmentAgencyOfficeCompany}${row}`).value = experience.DepartmentAgencyOfficeCompany || '';
        worksheet.getCell(`${columns.monthlySalary}${row}`).value = experience.MonthlySalary || '';
        worksheet.getCell(`${columns.salaryJobPayGrade}${row}`).value = experience.SalaryJobPayGrade || '';
        worksheet.getCell(`${columns.statusOfAppointment}${row}`).value = experience.StatusOfAppointment || '';
        worksheet.getCell(`${columns.govtService}${row}`).value = experience.GovtService ? 'Y' : 'N';
    });
}

module.exports = fillWorksheet2;