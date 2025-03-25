
const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    }
});

const Refund = mongoose.model('Refund', refundSchema);
module.exports = Refund;
