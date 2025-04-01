const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PricesSchema = new Schema({
    audioCall: {
        type: Number,
        default: 0,
        min: 0
    },
    videoCall: {
        type: Number,
        default: 0,
        min: 0
    },
    chat: {
        type: Number,
        default: 0,
        min: 0
    }
});

module.exports = mongoose.model('Prices', PricesSchema);