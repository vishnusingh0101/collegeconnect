const User = require('../model/user');

exports.addUser = async (req, res, next) => {
    const user = await User.create({
        name: req.body.userName,
        mail: req.body.mail,
        password: req.body.password
    });
    try{
        console.log(user);
        res.status(200).json(user);
    }catch(err) {
        res.status(500).json({error: err});
        res.status(403).json({error: "mail already exist..."});
    }
}