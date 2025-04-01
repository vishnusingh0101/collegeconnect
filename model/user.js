const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    mail: { type: String, unique: true, sparse: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true },
    registeras: { type: String, enum: ['Student', 'Teacher', 'Alumni'], required: false },
    phone: { type: String, required: true, trim: true, unique: true },
    collegeid: { type: String, default: null },
    emailIsVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    phoneIsVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    designation: { type: String, default: null },
    bio: { type: String, default: null },
    profile: { type: String, default: null },
    expertise: { type: [String], default: [] },
    description: { type: String, default: null },
    birthday: { type: Date, default: null },
    about: { type: mongoose.Schema.Types.ObjectId, ref: 'About' },
    prices: { type: mongoose.Schema.Types.ObjectId, ref: 'Prices' },
    scheduledCalls: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleCall' }
});

UserSchema.index({ phone: 1 });
UserSchema.index({ mail: 1 });

module.exports = mongoose.model('User', UserSchema);