const express = require('express'); //bring in express to app js file
const expressLayouts = require('express-ejs-layouts'); //bring in express layouts
const mongoose = require('mongoose'); //bring in mongoose
const flash = require('connect-flash');
const session = require('express-session');

const app = express(); //initialize app variable with express

//DB config
const db = require('./config/keys').MongoURI;

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected Successfully...'))
    .catch(err => console.log(err))

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

//Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000; //create port to run app on

app.listen(PORT, console.log(`Server Started on Port ${PORT}`)); //runs a server, and see what port it's running on