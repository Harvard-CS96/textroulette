// This file holds authentication details.  
// If we add google/twitter auth later that code will go here

module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FB_ID, // your App ID
        'clientSecret'  : process.env.FB_SECRET, // your App Secret
        'callbackURL'   : process.env.FB_CALLBACK
    }
};