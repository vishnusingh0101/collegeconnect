const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

const sequelize = require('./util/database');

const dataRoute = require('./routes/getData');
const userRoute = require('./routes/user');

const errorControl = require('./controller/error');
const Expence = require('./model/expence');
const User = require('./model/user');

app.use(bodyParser.json({extended: false}));

app.use(dataRoute);
app.use('/user', userRoute);

app.use(errorControl.get404);

User.hasMany(Expence);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));