
const express = require('express');

const router = express.Router();

const dataControl = require('../controller/dataControl');

router.get('/allExpence', dataControl.getAllExpence);

router.post('/addExpence', dataControl.postExpence);

router.delete('/delete/:id', dataControl.deleteExpence);

router.post('/edit', dataControl.postEditExpence);

module.exports = router;
