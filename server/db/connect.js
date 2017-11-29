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
conn.openUri(db_uri)
    .then(() => {
        console.log("Database: connected to " + db_uri);
    })
    .catch((err) => {
        console.log(err);
    });

// instantiate data models
// (mongoose waits until the connection is established to run these)
const Badge = mongoose.model("Badge", require('./models/badge'));
const Chat = mongoose.model("Chat", require('./models/chat'));
const User = mongoose.model("User", require('./models/user'));
const Question = mongoose.model("Question", require('./models/question'));
const Report = mongoose.model("Report", require('./models/report'));
const Criticism = mongoose.model("Criticism", require('./models/criticism'));

module.exports = {
    connection: conn,
    models: {
        Badge,
        Chat,
        User,
        Question,
        Report,
        Criticism
    }
};
