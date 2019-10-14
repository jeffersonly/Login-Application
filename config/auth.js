module.exports = {
    //protect routes to make sure user is logged in
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this page.');
        res.redirect('/users/login');
    }
}