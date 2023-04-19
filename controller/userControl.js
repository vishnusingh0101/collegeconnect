const User = require('../model/user');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res, next) => {
    try{
        const { name, mail, password } = req.body;
        console.log('name', name);
        console.log('email ', mail);
        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(err);
            await User.create({name, mail, password: hash});
            res.status(201).json({message: "Successfuly create new user"});
        })
    }catch(err) {
        res.status(500).json({error: err});
    }
}

exports.signIn = async (req, res, next) => {
    const { mail, password } = req.body;
    try {
        console.log(mail);
        console.log(password);
        const user = await User.findAll({where: {mail: mail}})
        if(user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, responce) => {
                if(!err){
                    res.status(200).json({success: true, message: 'Log in Success'});
                }else {
                    res.status(404).json({success: false, message: 'User do not exist...'});
                }
            })
        }else {
            res.status(500).json({success:false, message: 'not found'})
        }
    }catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}