async function fillWorksheet3(workbook, voluntaryWorks, learningDevelopments) {
    const worksheet = workbook.getWorksheet(3);

    fillVoluntaryWork(worksheet, voluntaryWorks);
    fillLearningDevelopment(worksheet, learningDevelopments);

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

function setFontAndAlignment(worksheet) {
    const cellsToFormat = [
        ...Array.from({length: 7}, (_, i) => `A${i+6}`),
        ...Array.from({length: 7}, (_, i) => `E${i+6}`),
        ...Array.from({length: 7}, (_, i) => `F${i+6}`),
        ...Array.from({length: 7}, (_, i) => `G${i+6}`),
        ...Array.from({length: 7}, (_, i) => `H${i+6}`)
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
