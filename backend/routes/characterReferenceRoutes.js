const express = require('express');
const router = express.Router();
const characterReferenceController = require('../controllers/characterReferenceController');

router.post('/', characterReferenceController.addCharacterReference);
router.put('/:id', characterReferenceController.updateCharacterReference);
router.get('/user/:id', characterReferenceController.getCharacterReference);
router.delete('/:id', characterReferenceController.deleteCharacterReference);

module.exports = router;
