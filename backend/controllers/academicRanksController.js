const AcademicRank = require('../models/academicRanksModel');
const User = require('../models/userModel');

exports.addOrUpdateAcademicRank = async (req, res) => {
  try {
    const { UserID, Rank } = req.body;

    // Check if the user exists
    const user = await User.findByPk(UserID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create the academic rank
    const [academicRank, created] = await AcademicRank.findOrCreate({
      where: { UserID },
      defaults: { Rank }
    });

    if (!created) {
      // If the rank already exists, update it
      academicRank.Rank = Rank;
      await academicRank.save();
    }

    res.status(200).json({
      message: created ? 'Academic rank added successfully' : 'Academic rank updated successfully',
      academicRank
    });
  } catch (error) {
    console.error('Error in addOrUpdateAcademicRank:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

exports.getAcademicRank = async (req, res) => {
  try {
    const { UserID } = req.params;

    const academicRank = await AcademicRank.findOne({ where: { UserID } });

    if (!academicRank) {
      return res.status(404).json({ message: 'Academic rank not found for this user' });
    }

    res.status(200).json(academicRank);
  } catch (error) {
    console.error('Error in getAcademicRank:', error);
    res.status(500).json({ message: 'Error fetching academic rank', error: error.message });
  }
};

exports.removeAcademicRank = async (req, res) => {
  try {
    const { UserID } = req.params;

    const deleted = await AcademicRank.destroy({ where: { UserID } });

    if (deleted) {
      res.status(200).json({ message: 'Academic rank removed successfully' });
    } else {
      res.status(404).json({ message: 'Academic rank not found for this user' });
    }
  } catch (error) {
    console.error('Error in removeAcademicRank:', error);
    res.status(500).json({ message: 'Error removing academic rank', error: error.message });
  }
};