
const express = require('express');

const router = express.Router();

const dataControl = require('../controller/expence');
const authenticator = require('../middleware/auth');

router.get('/allExpence', authenticator.authenticate, dataControl.getexpences);

router.post('/addExpence', authenticator.authenticate, dataControl.addExpence);

router.get('/download', authenticator.authenticate, dataControl.downloadexpence);

router.delete('/delete/:id/:amount', authenticator.authenticate, dataControl.deleteExpence);

router.post('/edit', authenticator.authenticate, dataControl.postEditExpence);

module.exports = router;
