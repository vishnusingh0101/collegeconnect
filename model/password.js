const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotpasswordSchema = new Schema({
    uuid: { type: String, required: true },
    active: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

forgotpasswordSchema.index({ uuid: 1 });

module.exports = mongoose.model('ForgotPassword', forgotpasswordSchema);