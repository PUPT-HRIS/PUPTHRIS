const multer = require('multer');
const xlsx = require('xlsx');
const AchievementAward = require('../models/achievementAwardsModel');
const OfficershipMembership = require('../models/officerMembershipModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.importExcelData = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert the sheet to JSON
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      // Process Achievement Awards
      const achievementAwards = processSection(data, 18);

      // Process Officership Membership
      const officershipMemberships = processSection(data, 25);

      // Save data to database
      await saveAchievementAwards(achievementAwards, req.body.userId);
      await saveOfficershipMemberships(officershipMemberships, req.body.userId);

      res.status(200).json({ 
        message: 'Data imported successfully',
        achievementsImported: achievementAwards.length,
        membershipsImported: officershipMemberships.length
      });
    } catch (error) {
      console.error('Error importing Excel data:', error);
      res.status(500).send('Error importing data');
    }
  }
];

function processSection(data, startRow) {
  const results = [];
  let currentRow = startRow + 1; // Start from the row after headers

  while (currentRow < data.length && data[currentRow].some(cell => cell !== '')) {
    const row = data[currentRow];
    if (row[0] || row[1]) { // Check if the row has data in the first or second column
      results.push({
        nameOfEmployee: row[0],
        awardOrOrganization: row[1],
        classification: row[2],
        awardGivingBodyOrPosition: row[3],
        level: row[4],
        venueOrAddress: row[5],
        fromDate: row[6],
        toDate: row[7],
        supportingDocuments: row[8]
      });
    }
    currentRow++;
  }

  return results;
}

async function saveAchievementAwards(awards, userId) {
  for (const award of awards) {
    await AchievementAward.findOrCreate({
      where: {
        UserID: userId,
        NatureOfAchievement: award.awardOrOrganization,
        AwardingBody: award.awardGivingBodyOrPosition,
        InclusiveDates: `${award.fromDate} - ${award.toDate}`
      },
      defaults: {
        Classification: award.classification,
        Level: award.level,
        Venue: award.venueOrAddress,
        // Map other fields as needed
      }
    });
  }
}

async function saveOfficershipMemberships(memberships, userId) {
  for (const membership of memberships) {
    await OfficershipMembership.findOrCreate({
      where: {
        UserID: userId,
        OrganizationName: membership.awardOrOrganization,
        Position: membership.awardGivingBodyOrPosition,
        InclusiveDatesFrom: membership.fromDate,
        InclusiveDatesTo: membership.toDate
      },
      defaults: {
        Classification: membership.classification,
        Level: membership.level,
        OrganizationAddress: membership.venueOrAddress,
        // Map other fields as needed
      }
    });
  }
}