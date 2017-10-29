/**
 * connect.js
 * Establish a database connection and instantiate data models.
 */

const mongoose = require('mongoose');

// use native promises
mongoose.Promise = global.Promise;

// standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
const db_uri = process.env.DB_URI; // load URI from environment variables

// connect to the mlab instance
var conn = mongoose.connection;
conn.openUri(db_uri)
    .then(() => {
        console.log("Database: connected to " + db_uri);
    })
    .catch((err) => {
        console.log(err);
    });

// instantiate data models
// (mongoose waits until the connection is established to run these)
const Chat = require('./models/chat');
const User = require('./models/user');

module.exports = {
    connection: conn,
    models: {
        Chat,
        User
    }
};
