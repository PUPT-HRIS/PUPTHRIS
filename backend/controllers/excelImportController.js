const multer = require('multer');
const xlsx = require('xlsx');
const AchievementAward = require('../models/achievementAwardsModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.importExcelData = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    try {
      console.log('File received:', req.file.originalname);
      console.log('User ID:', req.body.userId);

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      console.log('Workbook sheets:', workbook.SheetNames);

      const sheetName = workbook.SheetNames[0];
      
      // Process Achievement Awards
      const achievementAwards = processAchievementAwards(workbook, sheetName);
      console.log('Achievement Awards processed:', achievementAwards.length);
      console.log('Achievement Awards:', JSON.stringify(achievementAwards, null, 2));

      // Save data to database
      await saveAchievementAwards(achievementAwards, req.body.userId);

      res.status(200).json({ 
        message: 'Data imported successfully',
        achievementsImported: achievementAwards.length
      });
    } catch (error) {
      console.error('Error importing Excel data:', error);
      res.status(500).send('Error importing data');
    }
  }
];

function processAchievementAwards(workbook, sheetName) {
  console.log('Processing Achievement Awards');
  const results = [];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  let startRow = -1;

  // Find the start of the Achievement Awards section
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 'B. OUTSTANDING ACHIEVEMENTS/ AWARDS, OFFICERSHIP/MEMBERSHIP IN PROFESSIONAL ORGANIZATION/S, & TRAININGS/ SEMINARS ATTENDED') {
      startRow = i + 3; // Skip two rows after the header
      break;
    }
  }

  if (startRow === -1) {
    console.log('Achievement Awards section not found');
    return results;
  }

  console.log(`Starting to process from row ${startRow}`);

  // Process rows
  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    
    // Stop processing if we reach an empty row or a new section
    if (!row[0] || row[0].trim() === '' || row[0].startsWith('B.2')) {
      break;
    }

    // Skip rows that are likely headers or notes
    if (row[0].startsWith('*') || row[0].includes('Name of the Employee')) {
      continue;
    }

    // Extract hyperlink from column J
    const cellAddress = xlsx.utils.encode_cell({r: i, c: 9}); // Column J
    const cell = sheet[cellAddress];
    let proofLink = '';
    if (cell && cell.l) {
      proofLink = cell.l.Target || '';
    } else if (cell && cell.f && cell.f.startsWith('HYPERLINK')) {
      // Extract URL from HYPERLINK formula
      const match = cell.f.match(/"([^"]*)"/);
      if (match && match[1]) {
        proofLink = match[1];
      }
    }

    const award = {
      nameOfEmployee: row[0],
      natureOfAchievement: row[1],
      classification: row[2],
      awardingBody: row[3],
      level: row[4],
      venue: row[5],
      fromDate: row[6],
      toDate: row[7],
      supportingDocuments: row[8], // This is column I
      proof: proofLink, // Use the extracted hyperlink
      proofType: 'link'
    };

    results.push(award);
    console.log('Processed award:', JSON.stringify(award, null, 2));
  }

  console.log(`Finished processing. Total awards processed: ${results.length}`);
  return results;
}

async function saveAchievementAwards(awards, userId) {
  console.log(`Saving ${awards.length} Achievement Awards for user ${userId}`);
  for (const award of awards) {
    try {
      const [record, created] = await AchievementAward.findOrCreate({
        where: {
          UserID: userId,
          NatureOfAchievement: award.natureOfAchievement,
          AwardingBody: award.awardingBody,
          InclusiveDates: `${award.fromDate || 'N/A'} - ${award.toDate || 'N/A'}`
        },
        defaults: {
          NameOfEmployee: award.nameOfEmployee,
          Classification: award.classification,
          Level: award.level,
          Venue: award.venue,
          SupportingDocument: award.supportingDocuments,
          Proof: award.proof, // This should now contain the extracted hyperlink
          ProofType: award.proofType
        }
      });
      console.log(`Achievement Award ${created ? 'created' : 'already exists'}:`, JSON.stringify(record, null, 2));
    } catch (error) {
      console.error('Error saving Achievement Award:', error);
    }
  }
}