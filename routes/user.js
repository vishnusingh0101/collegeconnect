const express = require('express');
const router = express.Router();
const userControl = require('../controller/userControl');

router.post('/SignUp', userControl.signUp); 
router.post('/verify-otp', userControl.verifyOTP);
router.post('/resend-otp', userControl.resendOTP);
router.post('/login', userControl.login); 
module.exports = router;