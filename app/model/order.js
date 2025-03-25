const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    notes: {
        type: Map,
        of: String
    }
},
{timestamps:true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
