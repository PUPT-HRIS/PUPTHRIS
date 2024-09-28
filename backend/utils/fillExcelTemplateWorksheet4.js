const ExcelJS = require('exceljs');

async function fillWorksheet4(workbook, characterReferences) {
    const worksheet = workbook.getWorksheet(4);

    fillCharacterReferences(worksheet, characterReferences);

    // Set font and alignment for all filled cells
    setFontAndAlignment(worksheet);
}

function fillCharacterReferences(worksheet, characterReferences) {
    console.log("Character References data received:", JSON.stringify(characterReferences, null, 2));

    const startRow = 52;
    const endRow = 54;
    const columns = {
        name: 'A',
        address: 'F',
        telephoneNumber: 'G'
    };

    if (Array.isArray(characterReferences) && characterReferences.length > 0) {
        characterReferences.slice(0, endRow - startRow + 1).forEach((reference, index) => {
            const row = startRow + index;
            console.log(`Processing character reference at index ${index}:`, JSON.stringify(reference, null, 2));

            worksheet.getCell(`${columns.name}${row}`).value = reference.Name || '';
            worksheet.getCell(`${columns.address}${row}`).value = reference.Address || '';
            worksheet.getCell(`${columns.telephoneNumber}${row}`).value = reference.TelephoneNumber || '';

            console.log(`Cell values set for row ${row}`);
        });
    } else {
        console.log('No character references data available or data is not in expected format');
    }
}

function setFontAndAlignment(worksheet) {
    const cellsToFormat = [
        ...Array.from({length: 3}, (_, i) => `A${i+52}`),
        ...Array.from({length: 3}, (_, i) => `F${i+52}`),
        ...Array.from({length: 3}, (_, i) => `G${i+52}`)
    ];

    cellsToFormat.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
}

module.exports = fillWorksheet4;
