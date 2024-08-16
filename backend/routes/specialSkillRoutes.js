const express = require('express');
const router = express.Router();
const specialSkillController = require('../controllers/specialSkillController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/add', authenticateJWT, specialSkillController.addSpecialSkill);
router.patch('/update/:id', authenticateJWT, specialSkillController.updateSpecialSkill);
router.get('/user/:id', authenticateJWT, specialSkillController.getSpecialSkillsByUser);
router.delete('/delete/:id', authenticateJWT, specialSkillController.deleteSpecialSkill);

module.exports = router;
