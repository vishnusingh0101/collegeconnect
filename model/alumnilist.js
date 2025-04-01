const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allumniSchema = new Schema({
    name: { type: String, required: true, trim: true },
    profile: { type: String, trim: true },
    bio: { type: String, trim: true },
    expertise: { type: [String], required: false, default: [] },
    description: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', allumniSchema);