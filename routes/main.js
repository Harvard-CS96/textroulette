const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

var passport = require('passport');
require(path.join(DIR.ROOT, '/config/passport'))(passport);

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));

const router = express.Router();


var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
router.use(express.json());       // to support JSON-encoded bodies
router.use(express.urlencoded());




router.get('/', (req, res) => {
    res.sendFile(path.join(DIR.PUBLIC, "index.html"))
})

router.get('/questions/', questions.findForUser);

router.get('/questions', questions.findAll);


router.get('/updatePreferences', isLoggedIn, (req, res) => {
	console.log(req.user);
	console.log('update Prefs called');
    res.sendFile(path.join(DIR.PUBLIC, "updatePreferences.html"))
})

router.post('/updatePreferences', (req, res) => {
    res.send(req.body)
})

router.get('/login', (req, res) => {
    res.render("login", {
        fb_id: process.env.FB_ID
    })
})

// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook'));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/updatePreferences',
        failureRedirect : '/'
    }))

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
    res.redirect('/');
}


module.exports = router;

