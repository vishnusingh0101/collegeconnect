const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

const errorControl = require('./controller/error');

const userRoute = require('./routes/user');
const dataRoute = require('./routes/expence');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/password');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);

app.use(cors());
app.use(bodyParser.json({extended: false}));
app.use(morgan('combined', {stream: accessLogStream}));

app.use(userRoute);
app.use('/user', dataRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

app.use((req,res) => {
    res.sendFile(path.join(__dirname, `/public${req.url}`));
})

app.use(errorControl.get404);

mongoose.connect('mongodb+srv://vishnu:vishnu836921@cluster0.axx85zr.mongodb.net/test?retryWrites=true')
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));