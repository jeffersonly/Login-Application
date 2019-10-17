const LocalStrategy = require('passport-local').Strategy; //bringing in local strategy
const mongoose = require('mongoose'); //bring in mongoose to see if email matches, password, etc
const bcrypt = require('bcryptjs'); //bring in bcrypt to dehash and check if passwords match
const GoogleStrategy = require('passport-google-oauth20').Strategy; //bringing in google strategy
const keys = require('./keys'); // get keys

//Load user model
const User = require('../models/User');
const oAuthUser = require('../models/oAuthUser');

module.exports = function(passport) {
    //uses local strategy
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

    //uses google strategy
    passport.use(
        new GoogleStrategy({ 
            //options for the google strategy
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: 'http://localhost:5000/users/auth/google/callback'
        }, (accessToken, refreshToken, profile, done) => {
            oAuthUser.findOne({ googleId: profile.id }).then((currentUser) => {
                if(currentUser) {
                    //we alrdy have a record w/ given profile id
                    done(null, currentUser); //tells passport we're done
                } else {
                    new oAuthUser({
                        googleId: profile.id, 
                        email: profile.emails[0].value, 
                        name: profile.givenName + ' ' + profile.familyName 
                    }).save().then((newUser) => {
                        console.log('new user created:' + newUser);
                    });
                }
            })
        }
    ));
    

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById (id, (err, user) => {
            done(err, user);
        });
    });
}