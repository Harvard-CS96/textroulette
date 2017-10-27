/**
 * connect.js
 * Establish a database connection and instantiate data models.
 */

const mongoose = require('mongoose');

// standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
const db_uri = ""; // load URI from environment variables later

// connect to the mlab instance
var conn = mongoose.connection;
conn.openUri(db_uri)
    .then(() => {
        require('./models/chat');
        const User = require('./models/user');
    })

module.exports = {
    connection: conn
};
