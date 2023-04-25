const express = require('express');
const router = express.Router();

const passwordControl = require('../controller/password');

router.post('/forgotpassword', passwordControl.forgotpassword);
router.get('/resetpassword/:id', passwordControl.resetpassword);
router.post('/updatepassword/:id', passwordControl.updatepassword);

module.exports = router;