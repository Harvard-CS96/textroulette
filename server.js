/* server.js
 *
 * The main server dispatcher.
 *
 */

require('dotenv').config();

const {
  CONN_STATUS
} = require('./constants')
const {
  WAITING,
  PAIRING,
  DISCONNECTED
} = CONN_STATUS;

// to connect to the database and instantiate the data models
var db = require('./db/connect');

var server = require("http").createServer(app);

// Authentication
var passport = require('passport');

// Parsing post requests
var bodyParser = require('body-parser');
var multer = require('multer');

// ----------------
// Begin Merged code
// ----------------

/*global console*/
var config = require('getconfig'),
    fs = require('fs'),
    sockets = require('./sockets'),
    express = require('express');

var app = express();
var server = require("http").createServer(app);

var io = require("socket.io").listen(server);

// ----------------
// End Merged code
// ----------------


// to use the handlebars templating engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');


const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

const sharedsession = require("express-socket.io-session");

app.use(require('cookie-parser')());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());


io.use(sharedsession(session, {
  autoSave:true
}));

// to listen to port 3000
server.listen(process.env.PORT || 3000)

const Matcher = require('./matcher');
let matcher = new Matcher((id, status, partner = null, room = null) => {
  switch (status) {
    case WAITING:
      {
        // io.sockets.emit("meta", `${id} is waiting`)
        io.to(id).emit("waiting");
        break;
      }
    case PAIRING:
      {
        // io.sockets.emit("meta", `${id} is pairing to ${partner}`)
        io.to(id).emit("pairing", matcher.getUsername(partner), room);
        break;
      }
    case DISCONNECTED:
      {
        io.to(id).emit("disconnected", matcher.getUsername(partner))
      }
    default:
      {
        break;
      }
  }
})

// add callbacks to matcher
const chat = require('./controllers/chats');
matcher.addCallback(PAIRING,      chat.logConnection);
matcher.addCallback(DISCONNECTED, chat.logDisconnection);


sockets(server, io, matcher, config);

// Require our routes
const mainRoute = require('./routes/main')
app.use('/', mainRoute);

const createUtilRoute = require('./routes/util');
const utilRoute = createUtilRoute(matcher)
app.use('/util', utilRoute);

// Serve static resources
app.use('/static', express.static('static'))
