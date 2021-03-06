const LocalStrategy = require('passport-local').Strategy; //bringing in local strategy
const mongoose = require('mongoose'); //bring in mongoose to see if email matches, password, etc
const bcrypt = require('bcryptjs'); //bring in bcrypt to dehash and check if passwords match
const GoogleStrategy = require('passport-google-oauth20').Strategy; //bringing in google strategy
const FacebookStrategy = require('passport-facebook').Strategy;
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
                    //console.log({profile});
                } else {
                    new oAuthUser({
                        googleId: profile.id, 
                        email: profile.emails[0].value, 
                        name: profile.displayName
                    }).save().then((user) => {
                        //console.log({ user });
                        done(null, user); //callback to let passport know we done
                    });
                }
            })
        }
    ));

    passport.use(new FacebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: 'http://localhost:5000/users/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        oAuthUser.findOne({ facebookId: profile.id }).then((currentUser) => {
            if(currentUser) {
                //we alrdy have a record w/ given profile id
                done(null, currentUser); //tells passport we're done
                //console.log({profile});
            } else {
                new oAuthUser({
                    email: profile.email, 
                    facebookId: profile.id,
                    name: profile.displayName
                }).save().then((user) => {
                    //console.log({ user });
                    done(null, user); //callback to let passport know we done
                });
            }
        })
    }));

    passport.serializeUser((user, done) => {
        console.log("Serialize user called: " + user.id);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById (id, (err, user) => {
            console.log("Deserialize user called: " + user);
            //console.log(id);
            done(err, user);
        });
    });
}