// use the facebook API
const fb = require('fb');

var FacebookStrategy = require('passport-facebook').Strategy;
const uuid = require('uuid');

var User = require('../db/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    console.log("FBAuth: User found")
                    user.is_first_time = false;
                    user.save();
                    return done(null, user); // user found, return that user
                } 
                else {
                    console.log("FBAuth: User not found")
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
                    newUser.uuid = uuid();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    
                    // promise to get user's first name from facebook, then save user to database
                    fb.api('me', {fields: 'first_name', access_token: token})
                      .then( 
                        (res) => {
                            newUser.facebook.name  = res.first_name; 

                            // save our user to the database
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
        
                                // if successful, return the new user
                                return done(null, newUser);
                            });
                    });
    
                }

            });
        });

    }));

};