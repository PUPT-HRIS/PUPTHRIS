const express = require('express');
const familybackgroundController = require('../controllers/familybackgroundController');

const router = express.Router();

router.post('/add', familybackgroundController.addFamilyBackground);
router.patch('/update/:id', familybackgroundController.updateFamilyBackground);

module.exports = router;
