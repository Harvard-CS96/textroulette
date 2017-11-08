const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

const fb = require('fb');

var passport = require('passport');
require(path.join(DIR.ROOT, '/config/passport'))(passport);

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));
var users = require(path.join(DIR.ROOT, 'controllers/users'));

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    const hbsData = req.isAuthenticated() === true ?
        {
            isAuthenticated: 'true',
            user: JSON.stringify(req.user),
        } :
        {   
            isAuthenticated: 'false',
            user: JSON.stringify({}),
        }
    res.render("index", hbsData)
})

function getAuthInfo(req){
    const hbsData = req.isAuthenticated() === true ?
        {
            isAuthenticated: 'true',
            user: JSON.stringify(req.user)
        } :
        {   
            isAuthenticated: 'false',
            user: JSON.stringify({})
        }
    return hbsData;
}

// Either find specific questions or all questions.
router.get('/questions', (req, res) => {
    questions.findActive((results) => {
        res.send(results);
    });
});

// Update survey responses of a particular user.
router.post('/users/updateStance', (req, res) => {
    users.updateStance(req.body.uuid, req.body.questions_answered);
});

router.get('/updateStance', isLoggedIn, (req, res) => {
    res.render("updateStance", getAuthInfo(req));
})

router.get('/feedback', isLoggedIn, (req, res) => {
    res.render("feedback", getAuthInfo(req));
})

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
    req.logout()
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