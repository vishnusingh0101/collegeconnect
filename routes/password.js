const express = require('express');
const router = express.Router();

const passwordControl = require('../controller/password');

router.post('/forgotpassword', passwordControl.forgotpassword);
router.post('/verifyOtp', passwordControl.verifyOtp);
router.post('/updatepassword/:id', passwordControl.updatepassword);

module.exports = router;