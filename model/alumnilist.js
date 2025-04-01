const mongoose = require('mongoose');

const allumniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    profile: {
        type: String,  
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    expertise: {
        type: [String],
        required: false,
        default: []
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('allumni', allumniSchema);
