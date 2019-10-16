const express = require('express'); //bring in express
const router = express.Router(); //create express router
const bcrypt = require('bcryptjs') //bring in bcrypt
const passport = require('passport');
const nodemailer = require('nodemailer'); //used for reset password email sending
const async = require('async'); //used to avoid nested callbacks
const crypto = require('crypto'); //used to generate random token during password reset

//Google Email/Pass
const googlePass = require('../config/keys').googlePassword;

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('Login'));

//Register Page
router.get('/register', (req, res) => res.render('Register'));

//Forgot Password Page
router.get('/forgot', (req, res) => res.render('Forgot'));

//Reset Password Route
router.get('/reset', (req, res) => res.render('Reset'));

//Register handler
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body; //pull stuff out of req.body
    
    //Validation
    let errors = []; //initialize array of errors

    //check required fields to see if they're empty
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill out all fields on the form.'})
    }

    //check if passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match.' });
    }

    //check the password length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    //check to see if there are errors
    if(errors.length > 0) {
        //redo reg form, pass in data that's been filled in
        res.render('register', {
            errors,
            name, 
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ email: email }) //find the users email within db
            .then(user => {
                //check to see if user already exists
                if(user) {
                    errors.push({ msg: 'Email is already registered'});
                    res.render('register', {
                        errors,
                        name, 
                        email,
                        password,
                        password2
                    });
                } else { //if no user, create new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash Password so it's not plain text -- use bcrypt
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //Set password to hashed password
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Thank you for registering, proceed to log in!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });
    }
});

//Login handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: './dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "You have successfully logged out.");
    res.redirect('/users/login');
});

//Forgot Password Handler
router.post('/forgot', (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(5, function(err, buf) {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if(!user) {
                    req.flash('error_msg', 'No account with that email address exists.');
                    return res.redirect('/users/forgot');
                }

                //update the users password to be the token
                user.password = token;

                //Hash Password so it's not plain text -- use bcrypt
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err) throw err;
                    //Set password to hashed password
                    user.password = hash;
                    //save user
                    user.save()
                        .then(user => {
                            req.flash('success_msg', 'Password changed');
                        })
                        .catch(err => console.log(err));
                }))

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lyjefferson98@gmail.com',
                    pass: googlePass,
                }
            });
            let mailMessage = { 
                from: 'cmpe172proj@gmail.com',
                to: user.email,
                subject: 'Application Password Reset',
                text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                'Your new password is:' + token + '\n\n' + 'Please use this new password to reset your email' + '\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/users/reset/' 
            };
            transporter.sendMail(mailMessage, function(err, data) {
                if(err) {
                    console.log("error sending email");
                } else {
                    req.flash('success_msg', 'An email has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                }
            });
        }
    ], function(err) {
        if(err) return next(err);
        res.redirect('/users/forgot');
    });

});

//Reset Password Handler
router.post('/reset', (req, res) => {
    
});

module.exports = router;