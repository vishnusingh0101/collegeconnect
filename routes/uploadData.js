const express = require('express');
const router = express.Router();
const uploadController = require('../controller/uploaddata.js');

router.post('/uploadcolleges', uploadController.uploadColleges);

module.exports = router;
