
const express = require('express');

const router = express.Router();

const dataControl = require('../controller/expence');
const authenticator = require('../middleware/auth');

router.get('/allExpence', authenticator.authenticate, dataControl.getAllExpence);

router.post('/addExpence', authenticator.authenticate, dataControl.addExpence);

router.delete('/delete/:id/:amount', authenticator.authenticate, dataControl.deleteExpence);

router.post('/edit', authenticator.authenticate, dataControl.postEditExpence);

module.exports = router;
