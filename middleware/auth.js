const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.JWT_SECRET);
        User.findById({_id:user.userId}).then(user => {
            req.user = user;
            next();
        }).catch(err => {throw new Error(err)});
    }catch(err){
        return res.status(401).json({success: false})
    }
}

module.exports = {authenticate};