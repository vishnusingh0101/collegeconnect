const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

const sequelize = require('./util/database');

const dataRoute = require('./routes/getData');
const errorControl = require('./controller/error');

app.use(bodyParser.json({extended: false}));

app.use(dataRoute);
app.use(errorControl.get404);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));