const ExcelJS = require('exceljs');

async function fillWorksheet4(workbook, characterReferences, additionalQuestions) {
    const worksheet = workbook.getWorksheet(4);

    fillCharacterReferences(worksheet, characterReferences);
    fillAdditionalQuestions(worksheet, additionalQuestions);

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

function fillAdditionalQuestions(worksheet, additionalQuestions) {
    if (additionalQuestions) {
        // Q34a
        worksheet.getCell('I6').value = getYesNoString(additionalQuestions.Q34a);

        // Q34b
        worksheet.getCell('H8').value = getYesNoString(additionalQuestions.Q34b);

        // Q34a and Q34b details
        let detailsText = '';
        if (additionalQuestions.Q34a === 'Yes') {
            detailsText += `34a: ${additionalQuestions.Q34a_Details || ''}\n`;
        }
        if (additionalQuestions.Q34b === 'Yes') {
            detailsText += `34b: ${additionalQuestions.Q34b_Details || ''}`;
        }
        worksheet.getCell('H11').value = detailsText;

        worksheet.getCell('H13').value = getYesNoString(additionalQuestions.Q35a);
        worksheet.getCell('H18').value = getYesNoString(additionalQuestions.Q35b);

        worksheet.getCell('H23').value = getYesNoString(additionalQuestions.Q36);//

        worksheet.getCell('H31').value = getYesNoString(additionalQuestions.Q38);
        worksheet.getCell('H43').value = getYesNoString(additionalQuestions.Q40a);
        worksheet.getCell('H45').value = getYesNoString(additionalQuestions.Q40b);
        worksheet.getCell('H47').value = getYesNoString(additionalQuestions.Q40c);
    }
    
}

function getYesNoString(value) {
    if (value === 'Yes') {
        return '☑ Yes    ☐ No';
    } else if (value === 'No') {
        return '☐ Yes    ☑ No';
    } else {
        return '☐ Yes    ☐ No';
    }
}

function setFontAndAlignment(worksheet) {
    const cellsToFormat = [
        ...Array.from({length: 3}, (_, i) => `A${i+52}`),
        ...Array.from({length: 3}, (_, i) => `F${i+52}`),
        ...Array.from({length: 3}, (_, i) => `G${i+52}`),
        // Add cells for additional questions
        'H11', 'I6', 'I8'
    ];

    cellsToFormat.forEach(cellAddress => {
        const cell = worksheet.getCell(cellAddress);
        cell.font = { name: 'Arial', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    // Set left alignment for detail cells
    ['H11'].forEach(cellAddress => {
        worksheet.getCell(cellAddress).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    });

    // Adjust row height for detail cell
    worksheet.getRow(11).height = 30; // Adjust this value as needed
}

module.exports = fillWorksheet4;