const express = require('express');
const otherinformationController = require('../controllers/otherinformationController');

const router = express.Router();

router.post('/add', otherinformationController.addOtherInformation);
router.patch('/update/:id', otherinformationController.updateOtherInformation);


module.exports = router;
