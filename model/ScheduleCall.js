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
        enum: ['studentlist', 'alumnilist', 'teacher'],
        required: true
    },  
    callType:{ type: String, requirred: true},
    dateTime: { type: Date, required: true },
    duration: { type: Number, enum: [15, 30, 60], required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },

    // Payment-related fields
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed'], 
        default: 'Pending' 
    },
    paymentDetails: {
        paymentId: { type: String },
        transactionId: { type: String },
        amount: { type: Number }, 
        paymentDate: { type: Date },
        paymentGateway: { type: String, default: 'Razorpay' },
    },
    meetLink: {
        type: String,
        required: false,
    },  
}, { timestamps: true });

scheduleCallSchema.index({ caller: 1 });
scheduleCallSchema.index({ participant: 1 });
scheduleCallSchema.index({ dateTime: 1 });

module.exports = mongoose.model('ScheduleCall', scheduleCallSchema);
