const express = require('express');
const router = express.Router();
const importController = require('../controllers/excelImportController');

router.post('/import-excel', importController.importExcelData);

module.exports = router;