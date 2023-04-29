const express = require('express');


const purchaseControl = require('../controller/purchase');
const authenticator = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticator.authenticate, purchaseControl.purchasepremium);
router.post('/updateTransactionStatus', authenticator.authenticate, purchaseControl.updateTransactionStatus);
router.get('/showleaderbord', purchaseControl.leaderBord);
router.get('/ispremium', authenticator.authenticate, purchaseControl.ispremium);
router.get('/report', authenticator.authenticate, purchaseControl.report);

module.exports = router;