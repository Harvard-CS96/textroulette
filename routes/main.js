const path = require('path');
const express = require('express');
const DIR = require('../constants.js').DIR

const fb = require('fb');

var passport = require('passport');
require(path.join(DIR.ROOT, '/config/passport'))(passport);

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));
var users = require(path.join(DIR.ROOT, 'controllers/users'));
var chats = require(path.join(DIR.ROOT, 'controllers/chats'));
var reports = require(path.join(DIR.ROOT, 'controllers/reports'));

const router = express.Router();

function getAuthInfo(req){
    const hbsData = req.isAuthenticated() === true ?
        {
            isAuthenticated: 'true',
            user: JSON.stringify(req.user),
        } :
        {
            isAuthenticated: 'false',
            user: JSON.stringify({}),
        }
    return hbsData;
}

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("profile", getAuthInfo(req));
    } else {
        res.render("landing");
    }
})

router.get('/chat', isLoggedIn, (req, res) => {
    res.render('video', getAuthInfo(req));
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/text', isLoggedIn, (req, res) => {
    const hbsData = req.isAuthenticated() === true ?
        {
            isAuthenticated: 'true',
            user: JSON.stringify(req.user),
        } :
        {
            isAuthenticated: 'false',
            user: JSON.stringify({}),
        }
    res.render("text", hbsData)
})

// Get a user's profile page
router.get('/profile', isLoggedIn, (req, res) => {
    res.redirect('/');
});

// Get the user's JSON representation
router.get('/profile/user', isLoggedIn, (req, res) => {
   res.send(req.user);
});

// Get a user's leaderboard
router.get('/profile/leaderboard', isLoggedIn, (req, res) => {
    users.getLeaderboard(req.user.uuid, (results) => {
        res.send(results);
    })
});

// Get a user's chats
router.get('/profile/chats', isLoggedIn, (req, res) => {
    chats.getChatsForUUID(req.user.uuid, (results) => {
        res.send(results);
    })
})

// Either find specific questions or all questions.
router.get('/questions', (req, res) => {
    questions.findActive((questions) => {
        users.findById(req.user.uuid, (userData) => {
            res.send({questions: questions, userData: userData});
        });
    });
});

// Update survey responses of a particular user.
router.post('/updateStance', isLoggedIn, (req, res) => {
    users.updateStance(req.user.uuid, req.body.questions_answered);
});

router.get('/updateStance', isLoggedIn, (req, res) => {
    res.render("updateStance", getAuthInfo(req));
})

// Get feedback page
router.get('/feedback', isLoggedIn, (req, res) => {
    res.render("feedback", getAuthInfo(req));
})

// Submit new feedback
router.post('/feedback', (req, res) => {
    chats.logFeedback(req.body, (results) => {
        res.send(results);
    });
});

// Save new report
router.post('/feedback/report', isLoggedIn, (req, res) => {
    reports.createReport(req.body);
})

router.get('/login', (req, res) => {
    res.redirect('/auth/facebook');
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

// route for logging out
router.get('/terms-of-use', function(req, res) {
    res.render('termsOfUse');
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
