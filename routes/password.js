const express = require('express');
const router = express.Router();

<<<<<<< HEAD
const passwordControl = require('../controller/password');

router.post('/forgotpassword', passwordControl.forgotpassword);
router.get('/resetpassword/:id', passwordControl.resetpassword);
router.post('/updatepassword/:id', passwordControl.updatepassword);
=======
const userControl = require('../controller/userControl');

router.post('/forgotpassword', userControl.forgotpassword)
>>>>>>> 5a619ac0b636be792b88d67f738ec8140a3106c7

module.exports = router;