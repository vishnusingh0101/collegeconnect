const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const errorControl = require('./controller/error');

const userRoute = require('./routes/user');
const passwordRoute = require('./routes/password');

console.log("starting App");
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);

app.use(cors());
app.use(bodyParser.json({extended: false}));
app.use(morgan('combined', {stream: accessLogStream}));

app.use('/user', userRoute);
app.use('/password', passwordRoute);

app.use((req,res) => {
    res.sendFile(path.join(__dirname, `/public${req.url}`));
})

app.use(errorControl.get404);

mongoose.connect(process.env.MONGODB)
    .then(result => {
        console.log("Database Connected");
        app.listen(3000);
    })
    .catch(err => console.log(err));