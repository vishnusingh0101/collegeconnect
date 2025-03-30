const mongoose = require('mongoose');

const scheduleCallSchema = new mongoose.Schema({
    caller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'participantModel',
        required: true
    },
    participantModel: {
        type: String,
        enum: ['StudentList', 'AlumniList', 'Teacher'],
        required: true
    },
    dateTime: { type: Date, required: true },
    duration: { type: Number, enum: [15, 30, 60], required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('ScheduleCall', scheduleCallSchema);
