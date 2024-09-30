async function fillWorksheet3(workbook, voluntaryWorks, learningDevelopments, specialSkills, nonAcademics, memberships) {
    const worksheet = workbook.getWorksheet(3);

    fillVoluntaryWork(worksheet, voluntaryWorks);
    fillLearningDevelopment(worksheet, learningDevelopments);
    fillSpecialSkills(worksheet, specialSkills);
    fillNonAcademics(worksheet, nonAcademics);
    fillMemberships(worksheet, memberships);

    // Set font and alignment for all filled cells
    setFontAndAlignment(worksheet);
}

function fillVoluntaryWork(worksheet, voluntaryWorks) {
    console.log("Voluntary Works data received:", JSON.stringify(voluntaryWorks, null, 2));

    const startRow = 6;
    const endRow = 12;
    const columns = {
        organizationName: 'A',
        inclusiveDatesFrom: 'E',
        inclusiveDatesTo: 'F',
        numberOfHours: 'G',
        positionNatureOfWork: 'H'
    };

    if (Array.isArray(voluntaryWorks) && voluntaryWorks.length > 0) {
        voluntaryWorks.slice(0, endRow - startRow + 1).forEach((work, index) => {
            const row = startRow + index;
            console.log(`Processing voluntary work at index ${index}:`, JSON.stringify(work, null, 2));

            worksheet.getCell(`${columns.organizationName}${row}`).value = work.OrganizationNameAddress || '';
            worksheet.getCell(`${columns.inclusiveDatesFrom}${row}`).value = work.InclusiveDatesFrom ? new Date(work.InclusiveDatesFrom) : '';
            worksheet.getCell(`${columns.inclusiveDatesTo}${row}`).value = work.InclusiveDatesTo ? new Date(work.InclusiveDatesTo) : '';
            worksheet.getCell(`${columns.numberOfHours}${row}`).value = work.NumberOfHours || '';
            worksheet.getCell(`${columns.positionNatureOfWork}${row}`).value = work.PositionNatureOfWork || '';

            console.log(`Cell values set for row ${row}`);
        });
    } else {
        console.log('No voluntary work data available or data is not in expected format');
    }
}

function fillLearningDevelopment(worksheet, learningDevelopments) {
    console.log("Learning Development data received:", JSON.stringify(learningDevelopments, null, 2));

    const startRow = 18;
    const endRow = 38;
    const columns = {
        titleOfLearningDevelopment: 'A',
        inclusiveDatesFrom: 'E',
        inclusiveDatesTo: 'F',
        numberOfHours: 'G',
        typeOfLD: 'H',
        conductedSponsoredBy: 'I'
    };

    if (Array.isArray(learningDevelopments) && learningDevelopments.length > 0) {
        learningDevelopments.slice(0, endRow - startRow + 1).forEach((ld, index) => {
            const row = startRow + index;
            console.log(`Processing learning development at index ${index}:`, JSON.stringify(ld, null, 2));

            worksheet.getCell(`${columns.titleOfLearningDevelopment}${row}`).value = ld.TitleOfLearningDevelopment || '';
            worksheet.getCell(`${columns.inclusiveDatesFrom}${row}`).value = ld.InclusiveDatesFrom ? new Date(ld.InclusiveDatesFrom) : '';
            worksheet.getCell(`${columns.inclusiveDatesTo}${row}`).value = ld.InclusiveDatesTo ? new Date(ld.InclusiveDatesTo) : '';
            worksheet.getCell(`${columns.numberOfHours}${row}`).value = ld.NumberOfHours || '';
            worksheet.getCell(`${columns.typeOfLD}${row}`).value = ld.TypeOfLD || '';
            worksheet.getCell(`${columns.conductedSponsoredBy}${row}`).value = ld.ConductedSponsoredBy || '';

            console.log(`Cell values set for row ${row}`);
        });
    } else {
        console.log('No learning development data available or data is not in expected format');
    }
}

function fillSpecialSkills(worksheet, specialSkills) {
    console.log("Special Skills data received:", JSON.stringify(specialSkills, null, 2));

    const startRow = 42;
    const endRow = 48;

    if (Array.isArray(specialSkills) && specialSkills.length > 0) {
        specialSkills.slice(0, endRow - startRow + 1).forEach((skill, index) => {
            const row = startRow + index;
            console.log(`Processing special skill at index ${index}:`, JSON.stringify(skill, null, 2));

            worksheet.getCell(`A${row}`).value = skill.Skill || '';

            console.log(`Cell value set for row ${row}`);
        });
    } else {
        console.log('No special skills data available or data is not in expected format');
    }
}

function fillNonAcademics(worksheet, nonAcademics) {
    console.log("Non-Academic Distinctions data received:", JSON.stringify(nonAcademics, null, 2));

    const startRow = 42;
    const endRow = 48;

    if (Array.isArray(nonAcademics) && nonAcademics.length > 0) {
        nonAcademics.slice(0, endRow - startRow + 1).forEach((distinction, index) => {
            const row = startRow + index;
            console.log(`Processing non-academic distinction at index ${index}:`, JSON.stringify(distinction, null, 2));

            worksheet.getCell(`C${row}`).value = distinction.Distinction || '';

            console.log(`Cell value set for row ${row}`);
        });
    } else {
        console.log('No non-academic distinctions data available or data is not in expected format');
    }
}

function fillMemberships(worksheet, memberships) {
    console.log("Memberships data received:", JSON.stringify(memberships, null, 2));

    const startRow = 42;
    const endRow = 48;

    if (Array.isArray(memberships) && memberships.length > 0) {
        memberships.slice(0, endRow - startRow + 1).forEach((membership, index) => {
            const row = startRow + index;
            console.log(`Processing membership at index ${index}:`, JSON.stringify(membership, null, 2));

            worksheet.getCell(`I${row}`).value = membership.Association || '';

            console.log(`Cell value set for row ${row}`);
        });
    } else {
        console.log('No memberships data available or data is not in expected format');
    }
}

function setFontAndAlignment(worksheet) {
    const cellsToFormat = [
        ...Array.from({length: 7}, (_, i) => `A${i+6}`),
        ...Array.from({length: 7}, (_, i) => `E${i+6}`),
        ...Array.from({length: 7}, (_, i) => `F${i+6}`),
        ...Array.from({length: 7}, (_, i) => `G${i+6}`),
        ...Array.from({length: 7}, (_, i) => `H${i+6}`),
        ...Array.from({length: 7}, (_, i) => `A${i+42}`),
        ...Array.from({length: 7}, (_, i) => `C${i+42}`),
        ...Array.from({length: 7}, (_, i) => `I${i+42}`)
    ];

    cellsToFormat.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    const additionalCellsToFormat = [
        ...Array.from({length: 21}, (_, i) => `A${i+18}`),
        ...Array.from({length: 21}, (_, i) => `E${i+18}`),
        ...Array.from({length: 21}, (_, i) => `F${i+18}`),
        ...Array.from({length: 21}, (_, i) => `G${i+18}`),
        ...Array.from({length: 21}, (_, i) => `H${i+18}`),
        ...Array.from({length: 21}, (_, i) => `I${i+18}`)
    ];

    additionalCellsToFormat.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
}

module.exports = fillWorksheet3;