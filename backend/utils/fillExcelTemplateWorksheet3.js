async function fillWorksheet3(workbook, voluntaryWorks) {
    const worksheet = workbook.getWorksheet(3);

    fillVoluntaryWork(worksheet, voluntaryWorks);

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
}

module.exports = fillWorksheet3;
