const AchievementAward = require('../models/achievementAwardsModel');

exports.addAchievementAward = async (req, res) => {
  try {
    const newAchievementAward = await AchievementAward.create(req.body);
    res.status(201).json(newAchievementAward);
  } catch (error) {
    console.error('Error adding achievement award:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateAchievementAward = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await AchievementAward.update(updates, {
      where: { AchievementID: id }
    });
    if (updated) {
      const updatedAchievementAward = await AchievementAward.findOne({ where: { AchievementID: id } });
      res.status(200).json({ achievementAward: updatedAchievementAward });
    } else {
      res.status(404).send('Achievement award not found');
    }
  } catch (err) {
    console.error('Error updating achievement award:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAchievementAward = async (req, res) => {
  try {
    const { id } = req.params;
    const achievementAward = await AchievementAward.findOne({ where: { AchievementID: id } });
    if (achievementAward) {
      res.status(200).json(achievementAward);
    } else {
      res.status(404).send('Achievement award not found');
    }
  } catch (error) {
    console.error('Error getting achievement award:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAchievementAwardsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievementAwards = await AchievementAward.findAll({ where: { UserID: userId } });
    if (achievementAwards.length > 0) {
      res.status(200).json(achievementAwards);
    } else {
      res.status(404).send('No achievement awards found for this user');
    }
  } catch (error) {
    console.error('Error getting achievement awards:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteAchievementAward = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AchievementAward.destroy({ where: { AchievementID: id } });
    if (result) {
      res.status(200).json({ message: 'Achievement award deleted successfully' });
    } else {
      res.status(404).json({ error: 'Achievement award not found' });
    }
  } catch (error) {
    console.error('Error deleting achievement award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
