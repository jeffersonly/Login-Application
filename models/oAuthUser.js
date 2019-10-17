const mongoose = require('mongoose'); //bring in mongoose

const oAuthUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    googleId: {
        type: String,
        required: false
    },
    facebookId: {
        type: String,
        required: false
    }
});

const oAuthUser = mongoose.model('oAuthUser', oAuthUserSchema); //model for oauth users
module.exports = oAuthUser; //export to use in other files