const express = require('express');

const router = express.Router();

const userControl = require('../controller/userControl');

router.post('/SignUp', userControl.signUp);
router.post('/login', userControl.login);
router.get('/email/verify/:token', userControl.verifyEmail);

module.exports = router;