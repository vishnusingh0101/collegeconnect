const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collegesSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    university: { type: String, required: true },
    imgLink: { type: String },
    established: { type: Number },
    area: { type: String },
    naacGrade: { type: String },
    description: { type: String },
    mapLink: { type: String },
    address: { type: String, required: true }
});

collegesSchema.index({ university: 1 });
collegesSchema.index({ location: 1 });
collegesSchema.index({ naacGrade: 1 });

module.exports = mongoose.model('Colleges', collegesSchema);