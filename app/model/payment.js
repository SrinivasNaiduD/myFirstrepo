// models/payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    payment_capture: {
        type: Number,
        required: true
    }
},
{timestamps:true}
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
