const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    Name: { type: String, required: true, trim: true },
    Profile: { type: String, required: true, trim: true },
    Bio: { type: String, required: true, trim: true },
    Expertise: { type: String, trim: true },
    Description: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);