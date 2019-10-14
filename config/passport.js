const LocalStrategy = require('passport-local').Strategy; //bringing in local strategy
const mongoose = require('mongoose'); //bring in mongoose to see if email matches, password, etc
const bcrypt = require('bcryptjs'); //bring in bcrypt to dehash and check if passwords match

//Load user model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //match user to email in db
            User.findOne({ email: email })
                .then(user => {
                    //if user is not in db
                    if(!user) {
                        return done(null, false, { message: 'That email/username is not registered.'});
                    }

                    //match user to password in db
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password is incorrect.'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById (id, (err, user) => {
            done(err, user);
        });
    });
}