const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

const sequelize = require('./util/database');

const dataRoute = require('./routes/expence');
const userRoute = require('./routes/user');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/password');

const errorControl = require('./controller/error');
const Expence = require('./model/expence');
const User = require('./model/user');
const Order = require('./model/orders');
<<<<<<< HEAD
const Forgotpassword = require('./model/password');
=======
>>>>>>> 5a619ac0b636be792b88d67f738ec8140a3106c7

app.use(bodyParser.json({extended: false}));

app.use(dataRoute);
app.use('/user', userRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute)

app.use(errorControl.get404);

User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

<<<<<<< HEAD
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

=======
>>>>>>> 5a619ac0b636be792b88d67f738ec8140a3106c7
sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));