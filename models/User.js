const mongoose = require('mongoose'); //bring in mongoose
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
});

const User = mongoose.model('User', userSchema); //create model for our schema
module.exports = User; //export to use in other files