const express = require('express');
const router = express.Router();
const achievementAwardController = require('../controllers//achievementAwardsController');

router.post('/add', achievementAwardController.addAchievementAward);
router.patch('/:id', achievementAwardController.updateAchievementAward);
router.get('/:id', achievementAwardController.getAchievementAward);
router.get('/user/:userId', achievementAwardController.getAchievementAwardsByUserId);
router.delete('/:id', achievementAwardController.deleteAchievementAward);


module.exports = router;
