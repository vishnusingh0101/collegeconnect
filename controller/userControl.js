const User = require('../model/user');

exports.signUp = async (req, res, next) => {
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

exports.signIn = async (req, res, next) => {
    const mail = req.body.mail;
    const password = req.body.password;
    console.log(mail);
    console.log(password);
    User.findAll({where: {mail: mail}})
    .then(user => {
        if(user.length > 0) {
            if(user[0].password === password) {
                res.status(200).json({success: true, message: 'Log in Success'});
            }else {
                res.status(404).json({success: false, message: 'User do not exist...'});
            }
        }else {
            res.status(500).json({success:false, message: 'not found'})
        }
    })
    .catch(err => console.log(err));
}