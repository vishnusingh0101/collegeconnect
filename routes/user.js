const express = require('express');
const router = express.Router();
const userControl = require('../controller/userControl');
const auth = require('../middleware/auth.js');

router.post('/SignUp', userControl.signUp); 
router.post('/verify-otp', userControl.verifyOTP);
router.post('/resend-otp', userControl.resendOTP);
router.post('/login', userControl.login); 
router.post('/ScheduleCall',auth.authenticate, userControl.scheduleCall); 
router.post('/getCalls',auth.authenticate, userControl.getCalls); 

module.exports = router;