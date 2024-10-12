const multer = require('multer');
const xlsx = require('xlsx');
const AchievementAward = require('../models/achievementAwardsModel');
const OfficershipMembership = require('../models/officerMembershipModel');
const Trainings = require('../models/trainingsModel');
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

      // Process Officership/Membership
      const officershipMemberships = processOfficershipMemberships(workbook, sheetName);
      console.log('Officership/Memberships processed:', officershipMemberships.length);
      console.log('Officership/Memberships:', JSON.stringify(officershipMemberships, null, 2));

      // Save data to database
      await saveOfficershipMemberships(officershipMemberships, req.body.userId);

      // Process Trainings and Seminars
      const trainingsAndSeminars = processTrainingsAndSeminars(workbook, sheetName);
      console.log('Trainings and Seminars processed:', trainingsAndSeminars.length);
      console.log('Trainings and Seminars:', JSON.stringify(trainingsAndSeminars, null, 2));

      // Save data to database
      await saveTrainingsAndSeminars(trainingsAndSeminars, req.body.userId);

      res.status(200).json({ 
        message: 'Data imported successfully',
        achievementsImported: achievementAwards.length,
        trainingsImported: trainingsAndSeminars.length
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

function processOfficershipMemberships(workbook, sheetName) {
  console.log('Processing Officership/Memberships');
  const results = [];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  let startRow = -1;

  // Find the start of the Officership/Membership section
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 'B.2. Officership/ Membership in Professional Organization/s') {
      startRow = i + 2; // Skip one row after the header
      break;
    }
  }

  if (startRow === -1) {
    console.log('Officership/Membership section not found');
    return results;
  }

  console.log(`Starting to process from row ${startRow}`);

  // Process rows
  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    
    // Stop processing if we reach an empty row or a new section
    if (!row[0] || row[0].trim() === '' || row[0].startsWith('B.3')) {
      break;
    }

    // Skip rows that are likely headers or notes
    if (row[0].startsWith('*') || row[0].includes('Name of Organization')) {
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

    const membership = {
      OrganizationName: row[1],
      Classification: row[2],
      Position: row[3],
      Level: row[4],
      OrganizationAddress: row[5],
      InclusiveDatesFrom: row[6],
      InclusiveDatesTo: row[7],
      Remarks: row[7],
      SupportingDocument: row[8],
      Proof: proofLink,
      ProofType: 'link'
    };

    results.push(membership);
    console.log('Processed membership:', JSON.stringify(membership, null, 2));
  }

  console.log(`Finished processing. Total memberships processed: ${results.length}`);
  return results;
}

async function saveOfficershipMemberships(memberships, userId) {
  console.log(`Saving ${memberships.length} Officership/Memberships for user ${userId}`);
  for (const membership of memberships) {
    try {
      console.log('Processing membership:', JSON.stringify(membership, null, 2));

      const [record, created] = await OfficershipMembership.findOrCreate({
        where: {
          UserID: userId,
          OrganizationName: membership.OrganizationName,
          Position: membership.Position,
          InclusiveDatesFrom: parseDate(membership.InclusiveDatesFrom),
          InclusiveDatesTo: parseDate(membership.InclusiveDatesTo)
        },
        defaults: {
          ...membership,
          UserID: userId,
          Level: membership.Level,
          Classification: membership.Classification,
          InclusiveDatesFrom: parseDate(membership.InclusiveDatesFrom),
          InclusiveDatesTo: parseDate(membership.InclusiveDatesTo)
        }
      });

      console.log(`Officership/Membership ${created ? 'created' : 'already exists'}:`, JSON.stringify(record, null, 2));
    } catch (error) {
      console.error('Error saving Officership/Membership:', error);
    }
  }
}

function processTrainingsAndSeminars(workbook, sheetName) {
  console.log('Processing Trainings and Seminars');
  const results = [];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  let startRow = -1;
  let currentSection = '';

  // Process both sections
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Check for section headers
    if (row[0] && row[0].includes('B.3.1 Attendance in Relevant Faculty Development Program')) {
      startRow = i + 2;
      currentSection = 'FacultyDevelopment';
      console.log(`Found Faculty Development section at row ${startRow + 1}`);
      continue;
    } else if (row[0] && row[0].includes('B.3.2. Attendance in Training/s')) {
      startRow = i + 2;
      currentSection = 'Training';
      console.log(`Found Training section at row ${startRow + 1}`);
      continue;
    }

    // Process rows if we're in a valid section
    if (startRow !== -1 && i >= startRow) {
      console.log(`Processing row ${i + 1}:`, JSON.stringify(row));

      // Stop processing if we reach an empty row or a new section
      if (row.every(cell => !cell) || (row[0] && row[0].startsWith('*'))) {
        console.log(`Stopping at row ${i + 1} due to empty row or new section`);
        startRow = -1; // Reset startRow to look for the next section
        continue;
      }

      // Skip rows that don't have a title (assuming title is in the second column)
      if (!row[1]) {
        console.log(`Skipping row ${i + 1} due to missing title`);
        continue;
      }

      // Extract hyperlink from column J (index 9) for Faculty Development or column M (index 12) for Training
      const cellAddress = xlsx.utils.encode_cell({r: i, c: currentSection === 'FacultyDevelopment' ? 9 : 12});
      const cell = sheet[cellAddress];
      let proofLink = '';
      if (cell && cell.l) {
        proofLink = cell.l.Target || '';
      } else if (cell && cell.f && cell.f.startsWith('HYPERLINK')) {
        const match = cell.f.match(/"([^"]*)"/);
        if (match && match[1]) {
          proofLink = match[1];
        }
      }

      const training = {
        Title: row[1],
        Classification: row[2],
        Nature: row[3],
        Budget: row[4],
        SourceOfFund: row[5],
        Organizer: row[6],
        Level: row[7],
        Venue: row[8],
        DateFrom: row[9],
        DateTo: row[10],
        NumberOfHours: row[11],
        SupportingDocuments: currentSection === 'FacultyDevelopment' ? row[12] : row[13],
        Proof: proofLink,
        ProofType: 'link',
        Type: currentSection
      };

      results.push(training);
      console.log('Processed training:', JSON.stringify(training, null, 2));
    }
  }

  console.log(`Finished processing. Total trainings processed: ${results.length}`);
  return results;
}

async function saveTrainingsAndSeminars(trainings, userId) {
  console.log(`Saving ${trainings.length} Trainings and Seminars for user ${userId}`);
  for (const training of trainings) {
    try {
      const [record, created] = await Trainings.findOrCreate({
        where: {
          UserID: userId,
          Title: training.Title,
          DateFrom: training.DateFrom,
          DateTo: training.DateTo
        },
        defaults: {
          ...training,
          UserID: userId
        }
      });
      console.log(`Training/Seminar ${created ? 'created' : 'already exists'}:`, JSON.stringify(record, null, 2));
    } catch (error) {
      console.error('Error saving Training/Seminar:', error);
    }
  }
}

function parseDate(dateString) {
  const [month, day, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}