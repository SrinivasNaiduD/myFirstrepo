const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phone: String,
},
{timestamps:true}
);
const user = new mongoose.model('coll_name', schema);
module.exports = user;
//module.exports = new mongoose.model('collecttion name in database',schema);
