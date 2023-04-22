const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

function generateToken(id, name) {
    return jwt.sign({userId: id, name: name}, 'secretVishnu');
}

exports.login = async (req, res, next) => {
    const { mail, password } = req.body;
    try {
        console.log(mail);
        console.log(password);
        const user = await User.findAll({where: {mail: mail}});
        if(user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong');
                }
                if(result == true){
                    console.log(user[0]);
                    res.status(200).json({success: true, message: 'Log in Success', token: generateToken(user[0].id, user[0].name), ispremium: user[0].ispremiumuser});
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

