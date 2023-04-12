
const express = require('express');

const router = express.Router();

const dataControl = require('../controller/dataControl');

router.get('/allExpence', dataControl.getAllExpence);

router.post('/add-expence', dataControl.postExpence);

router.delete('/delete/:id', dataControl.deleteExpence);

module.exports = router;
