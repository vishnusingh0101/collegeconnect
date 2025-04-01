const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutSchema = new Schema({
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
});


module.exports = mongoose.model('About', AboutSchema);