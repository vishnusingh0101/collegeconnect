const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mail: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true
    },
    registeras: {
        type: String,
        required: false
    },
    joinas: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    collegeid: {
        type: String,
        default: null
    }, 
    emailIsVerified: { 
        type: Boolean, 
        default: false 
    },
    emailVerificationToken: { 
        type: String 
    }, 
    phoneIsVerified: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Users', userSchema);
