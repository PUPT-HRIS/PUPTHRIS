const express = require('express');
const achievementAwardsController = require('../controllers/achievementAwardsController');

const router = express.Router();

router.post('/add', achievementAwardsController.addAchievementAward);
router.patch('/update/:id', achievementAwardsController.updateAchievementAward);
router.get('/:id', achievementAwardsController.getAchievementAward);
router.get('/user/:userId', achievementAwardsController.getAchievementAwardsByUserId);
router.delete('/delete/:id', achievementAwardsController.deleteAchievementAward);

module.exports = router;
