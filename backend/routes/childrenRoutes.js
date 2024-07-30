const express = require('express');
const childrenController = require('../controllers/childrenController');

const router = express.Router();

router.post('/add', childrenController.addChild);
router.patch('/update/:id', childrenController.updateChild);

module.exports = router;
