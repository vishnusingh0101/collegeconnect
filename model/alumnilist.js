const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
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
        type: [String], // Array of expertise (e.g., ["Web Development", "Marketing"])
        required: false,
        default: []
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
