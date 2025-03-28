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
        sparse: true,
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
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
    },
    otp: { 
        type: String, 
        default: null 
    },
    otpExpires: { 
        type: Date, 
        default: null 
    },
    designation: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    profile: {
        type: String,
        default: null,
    },
    expertise: { 
        type: [String], 
        default: [] 
    },
    description: {
        type: String,
        default: null,
    },
    birthday: {
        type: Date,
        default: null,
    },
    about: {
        totalWorkExperience: {
            type: Number,
            min: 0,
            default: 0
        },
        location: {
            type: String,
            trim: true
        },
        currentOrganisation: {
            type: String,
            maxlength: 110,
            trim: true,
            default: null
        },
        description: {
            type: String,
            maxlength: 280,
            trim: true
        },
        expertise: { 
            type: [String], 
            default: [] 
        }
    },
    prices: {
        audioCall: {
            type: Number,
            default: 0,
            min: 0
        },
        videoCall: {
            type: Number,
            default: 0,
            min: 0
        },
        chat: {
            type: Number,
            default: 0,
            min: 0
        }
    }
});

module.exports = mongoose.model('users', userSchema);