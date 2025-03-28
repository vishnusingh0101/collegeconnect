const express = require('express');

const router = express.Router();

const collegesControl = require('../controller/colleges.js');

router.get('/collegelist', collegesControl.collegeList);

module.exports = router; 