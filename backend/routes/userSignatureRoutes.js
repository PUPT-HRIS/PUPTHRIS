const express = require('express');
const userSignatureController = require('../controllers/userSignatureController');

const router = express.Router();

router.post('/', userSignatureController.addUserSignature);
router.get('/:id', userSignatureController.getUserSignature);

module.exports = router;
