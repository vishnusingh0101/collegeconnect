const express = require('express');


const purchaseControl = require('../controller/premium');
const authenticator = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticator.authenticate, purchaseControl.purchasepremium);
router.post('/updateTransactionStatus', authenticator.authenticate, purchaseControl.updateTransactionStatus);


module.exports = router;