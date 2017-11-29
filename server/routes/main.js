const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = express.Router();

const DIR = require('../constants.js').DIR

const fb = require('fb');

var passport = require('passport');
require(path.join(DIR.ROOT, '/config/passport'))(passport);

var questions = require(path.join(DIR.ROOT, 'controllers/questions'));
var users = require(path.join(DIR.ROOT, 'controllers/users'));
var chats = require(path.join(DIR.ROOT, 'controllers/chats'));
var reports = require(path.join(DIR.ROOT, 'controllers/reports'));
var badges = require(path.join(DIR.ROOT, 'controllers/badges'));
var criticisms = require(path.join(DIR.ROOT, 'controllers/criticisms'));


function getAuthInfo(req) {
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
    res.render("react", getAuthInfo(req))
})

router.get('/video', isLoggedIn, (req, res) => {
    res.render("video", getAuthInfo(req));
})

router.get('/text', isLoggedIn, (req, res) => {
    res.render("text", getAuthInfo(req))
})

// Get a user document from the db by uuid
router.get('/profile', isLoggedIn, (req, res) => {
    users.findById(req.body.uuid, (results) => {
        res.send(results);
    });
});

// Get a user's leaderboard
router.get('/profile/leaderboard', isLoggedIn, (req, res) => {
    users.getLeaderboard(req.user.uuid, (results) => {
        res.send(results);
    })
});

// Either find specific questions or all questions.
router.get('/questions', isLoggedIn, (req, res) => {
    questions.findActive((questions) => {
        users.findById(req.user.uuid, (userData) => {
            res.send({ questions: questions, userData: userData });
        });
    });
});

// Either find specific questions or all questions.
router.post('/chats', isLoggedIn, (req, res) => {
    const feedback = {
        from: req.user.uuid,
        stars: req.body.stars,
        badges: req.body.badges
    }
    chats.logFeedback(feedback, (results) => {
        res.send(results);
    });
});

// Update survey responses of a particular user.
router.post('/updateStance', (req, res) => {
    users.updateStance(req.body.uuid, req.body.questions_answered);
});

router.get('/updateStance', isLoggedIn, (req, res) => {
    res.render("updateStance", getAuthInfo(req));
})

router.get('/feedback_legacy', isLoggedIn, (req, res) => {
    res.render("feedback", getAuthInfo(req));
})

router.post('/feedback/report', isLoggedIn, (req, res) => {
    const reportData = { 
        from: req.user.uuid,
        kind: req.body.kind,
        text: req.body.text,
    }
    reports.createReport(reportData);
    res.json({ success: true })
})

router.get('/login', (req, res) => {
    res.render("login")
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/');
})

// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook'));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/error'
    }))

router.get('/auth/error', (req, res) => { res.end('Auth failure :(') })

// route for logging out
router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/');
})

router.get('/badges/list', (req, res) => {
    return badges.listAll()
        .then(badges => {
            console.log(badges)
            res.json(badges)
        })
        .catch(err => {
            console.log(err)
            res.json({
                error: err
            })
        })
})

router.get('/criticisms/list', (req, res) => {
    return criticisms.listAll()
        .then(criticisms => {
            console.log(criticisms)
            res.json(criticisms)
        })
        .catch(err => {
            console.log(err)
            res.json({
                error: err
            })
        })
})

router.get('/system-check', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({
            authenticated: false,
            status: false
        })
    }
    return res.json({
        'check': req.session.systemCheck === true // true | false
    })
})

router.post('/system-check', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({
            authenticated: false,
            status: false
        })
    }

    const { check = false } = req.body;

    req.session.systemCheck = (
        check === true ||
        check === 'true'
    );
    req.session.save(function () {
        res.json({
            status: req.session.systemCheck === true // true | false
        })
    });
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
