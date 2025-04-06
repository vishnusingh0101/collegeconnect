const express = require('express');
const router = express.Router();

const passwordControl = require('../controller/password');

router.post('/request-password-reset', passwordControl.requestPasswordReset);
router.post('/verify-password-reset', passwordControl.verifyPasswordResetOTP);
router.post('/reset-password', passwordControl.resetPassword);

module.exports = router;
