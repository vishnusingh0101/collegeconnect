const express = require('express');

const router = express.Router();

const collegesControl = require('../controller/getdata.js');
const auth = require('../middleware/auth.js');

router.get('/collegelist',auth.authenticate, collegesControl.collegeList);
router.get('/alumnilist',auth.authenticate, collegesControl.alumniList);
router.get('/studentlist',auth.authenticate, collegesControl.studentList);

module.exports = router; 