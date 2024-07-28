const express = require('express');
const familybackgroundController = require('../controllers/familybackgroundController');

const router = express.Router();

router.post('/add', familybackgroundController.addFamilyBackground);

module.exports = router;
