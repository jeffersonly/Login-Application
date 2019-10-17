const express = require('express'); //bring in express to app js file
const expressLayouts = require('express-ejs-layouts'); //bring in express layouts
const mongoose = require('mongoose'); //bring in mongoose
const flash = require('connect-flash'); //will be used for flash messaging
const session = require('express-session'); //keeps a session of the express serv
const passport = require('passport'); //used for authentication
const cookieSession = require('cookie-session'); //used for oauth authentication cookie storing
const keys = require('./config/keys');

const app = express(); //initialize app variable with express

//DB config
const db = require('./config/keys').MongoURI;

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected Successfully...'))
    .catch(err => console.log(err))

//Passport config
require('./config/passport')(passport);

//use cookie session - encrypts cookie
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extender: false })); //can get data from our form with request.body

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000; //create port to run app on

app.listen(PORT, console.log(`Server Started on Port ${PORT}`)); //runs a server, and see what port it's running on