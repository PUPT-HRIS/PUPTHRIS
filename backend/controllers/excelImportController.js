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

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert the sheet to JSON
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      console.log('Total rows in sheet:', data.length);

      // Process Achievement Awards
      const achievementAwards = processAchievementAwards(data);
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

function processAchievementAwards(data) {
  console.log('Processing Achievement Awards');
  const results = [];
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

    const award = {
      nameOfEmployee: row[0],
      natureOfAchievement: row[1],
      classification: row[2],
      awardingBody: row[3],
      level: row[4],
      venue: row[5],
      fromDate: row[6],
      toDate: row[7],
      supportingDocuments: row[8]
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
          SupportingDocument: award.supportingDocuments
        }
      });
      console.log(`Achievement Award ${created ? 'created' : 'already exists'}:`, JSON.stringify(record, null, 2));
    } catch (error) {
      console.error('Error saving Achievement Award:', error);
    }
  }
}