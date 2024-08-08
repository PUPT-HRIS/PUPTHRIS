const express = require('express');
const router = express.Router();
const specialSkillController = require('../controllers/specialSkillController');

router.post('/add', specialSkillController.addSpecialSkill);
router.patch('/update/:id', specialSkillController.updateSpecialSkill);
router.get('/employee/:id', specialSkillController.getSpecialSkillsByEmployee);

module.exports = router;
