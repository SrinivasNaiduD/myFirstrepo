const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sampleSchema = new Schema({
    // String Type
    name: {
        type: String,
        default: '',
        trim: true,       // Removes extra spaces
        lowercase: true,  // Converts to lowercase
        minlength: 3,     // Minimum length
        maxlength: 50     // Maximum length
    },

    // Number Type
    age: {
        type: Number,
        min: 0,           // Minimum value
        max: 150,         // Maximum value
        default: 18
    },

    // Boolean Type
    isActive: {
        type: Boolean,
        default: true
    },

    // Date Type
    dateOfBirth: {
        type: Date,
        default: Date.now  // Sets the current date as default
    },

    // Array of Strings
    hobbies: {
        type: [String],
        default: []        // Default empty array
    },

    // Array of Numbers
    scores: {
        type: [Number],
        default: [0]       // Default array with one element
    },

    // Embedded Document (Subdocument)
    address: {
        street: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        zipCode: {
            type: Number
        }
    },

    // Array of Subdocuments
    contacts: [
        {
            type: {
                type: String,
                enum: ['email', 'phone'],  // Restricts to specific values
                required: true
            },
            detail: {
                type: String,
                required: true
            }
        }
    ],

    // Mixed Type (can store any data)
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },

    // ObjectId (used for references)
    userRef: {
        type: Schema.Types.ObjectId,
        ref: 'User'       // Refers to the User collection
    },

    // Decimal128 (for precise decimal numbers)
    accountBalance: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0
    },

    // Buffer (for storing binary data)
    profilePicture: {
        type: Buffer
    },

    // Map (key-value pairs)
    settings: {
        type: Map,
        of: String         // Values will be of type String
    },

    // Enum (restricts to specific values)
    role: {
        type: String,
        enum: ['admin', 'user', 'guest'],
        default: 'user'
    },

    // Custom Validation Example
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v); // Simple email regex
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, 'Email is required']
    }
},
{ timestamps: true }); 

module.exports = mongoose.model('Sample', sampleSchema);
