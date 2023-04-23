const express = require('express');
const router = express.Router();

const userControl = require('../controller/userControl');

router.post('/forgotpassword', userControl.forgotpassword)

module.exports = router;