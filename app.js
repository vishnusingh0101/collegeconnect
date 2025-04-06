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
const collegeRoute = require('./routes/getdata'); 
const paymentRoute = require('./routes/payment'); 

console.log("Starting App");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Body:`, req.body);
    next();
});

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/user', userRoute);
app.use('/password', passwordRoute);
app.use('/college', collegeRoute);
app.use('/payment', paymentRoute);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorControl.get404);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);

        console.log("Database Connected");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.error("Database Connection Error:", err);
    }
};

startServer();
