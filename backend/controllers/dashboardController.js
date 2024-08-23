const User = require('../models/userModel');
const BasicDetails = require('../models/basicDetailsModel');

exports.getDashboardData = async (req, res) => {
  try {
    const totalFemale = await BasicDetails.count({ where: { Sex: 'Female' } });
    const totalMale = await BasicDetails.count({ where: { Sex: 'Male' } });
    const partTime = await User.count({ where: { EmploymentType: 'parttime' } });
    const fullTime = await User.count({ where: { EmploymentType: 'fulltime' } });
    const temporary = await User.count({ where: { EmploymentType: 'temporary' } });
    const faculty = await User.count({ where: { Role: 'faculty' } });
    const staff = await User.count({ where: { Role: 'staff' } });

    res.status(200).json({
      totalFemale,
      totalMale,
      partTime,
      fullTime,
      temporary,
      faculty,
      staff
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};
