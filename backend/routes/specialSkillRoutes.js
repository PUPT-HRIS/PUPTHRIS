const express = require('express');
const router = express.Router();
const specialSkillController = require('../controllers/specialSkillController');

router.post('/add', specialSkillController.addSpecialSkill);
router.patch('/update/:id', specialSkillController.updateSpecialSkill);
router.get('/employee/:id', specialSkillController.getSpecialSkillsByEmployee);
router.delete('/delete/:id', specialSkillController.deleteSpecialSkill);  // Add this line

module.exports = router;
