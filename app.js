const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
const helmet = require('helmet');

const sequelize = require('./util/database');

const errorControl = require('./controller/error');

const dataRoute = require('./routes/expence');
const userRoute = require('./routes/user');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/password');

const Expence = require('./model/expence');
const User = require('./model/user');
const Order = require('./model/orders');
const Report = require('./model/report');
const Forgotpassword = require('./model/password');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({extended: false}));
app.use(morgan('combined', {stream: accessLogStream}));

app.use(userRoute);
app.use('/user', dataRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute)

app.use((req,res) => {
    res.sendFile(join(path.__dirname), `public/${req.url}`);
})

app.use(errorControl.get404);

User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Report);
Report.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));