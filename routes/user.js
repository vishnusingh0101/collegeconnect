const express = require('express');

const router = express.Router();

const userControl = require('../controller/userControl');

router.post('/SignUp', userControl.signUp);
router.post('/SignIn', userControl.signIn);

module.exports = router;