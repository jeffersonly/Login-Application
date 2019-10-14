const express = require('express'); //bring in express
const router = express.Router(); //create express router
const bcrypt = require('bcryptjs') //bring in bcrypt

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('Login'));

//Register Page
router.get('/register', (req, res) => res.render('Register'));

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

module.exports = router;