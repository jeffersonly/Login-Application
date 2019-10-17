const express = require('express'); //bring in express
const router = express.Router(); //create express router
const { ensureAuthenticated } = require('../config/auth');

//Renders welcome page view
router.get('/', (req, res) => res.render('welcome'));
    
module.exports = router;