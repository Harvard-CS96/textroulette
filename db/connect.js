/**
 * connect.js
 * Establish a database connection and instantiate data models.
 * Good resource: https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/mongooseSimpleExample.js
 * And: http://bigspaceship.github.io/blog/2014/05/14/how-to-create-a-rest-api-with-node-dot-js/
 */

const mongoose = require('mongoose');

// use native promises
mongoose.Promise = global.Promise;

// standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
const db_uri = process.env.DB_URI; // load URI from environment variables

// connect to the mlab instance
var conn = mongoose.connection;
var options = {
    keepAlive: 300000,
    connectTimeoutMS: 30000,
};
conn.openUri(db_uri, options)
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
const Question = require('./models/question');
const Report = require('./models/report');

module.exports = {
    connection: conn,
    models: {
        Chat,
        User,
        Question,
        Report
    }
};
