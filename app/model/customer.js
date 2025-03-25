const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    
},{timestamps:true}
);

const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
