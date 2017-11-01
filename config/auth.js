// This file holds authentication details.  
// If we add google/twitter auth later that code will go here

module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FB_ID, // your App ID
        'clientSecret'  : process.env.APP_SECRET, // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    }

};