
const express = require('express');

const router = express.Router();

const dataControl = require('../controller/dataControl');
const userControl = require('../controller/userControl');

router.get('/allExpence', dataControl.getAllExpence);

router.post('/addExpence', dataControl.postExpence);

router.delete('/delete/:id', dataControl.deleteExpence);

router.post('/edit', dataControl.postEditExpence);

router.post('/addUser', userControl.addUser);

module.exports = router;
