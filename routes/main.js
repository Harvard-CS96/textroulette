const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

var passport = require('passport');
require(path.join(DIR.ROOT, '/config/passport'))(passport);

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    // res.sendFile(path.join(DIR.PUBLIC, "index.html"))
    const hbsData = req.isAuthenticated() === true ?
        {
            isAuthenticated: 'true',
            user: JSON.stringify(req.user)
        } :
        {   
            isAuthenticated: 'false',
            user: JSON.stringify({})
        }
    res.render("index", hbsData)
})

// Either find specific questions or all questions.
router.get('/questions/', questions.findForUser);
router.get('/questions', questions.findAll);

// Update survey responses of a particular user.
router.post('/users/updatePrefereces/', users.updatePrefereces);

router.get('/updatePreferences', isLoggedIn, (req, res) => {
    res.sendFile(path.join(DIR.PUBLIC, "updatePreferences.html"))
})

// router.post('/updatePreferences', (req, res) => {
//     res.send(req.body)
// })

router.get('/login', (req, res) => {
    res.render("login")
})

// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook'));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/auth/error'
    }))

router.get('/auth/error', (req, res) => { res.end('Auth failure :(') })

    // route for logging out
router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
}


module.exports = router;