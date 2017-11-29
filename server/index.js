/* server.js
 *
 * The main server dispatcher.
 *
 */

// require('dotenv').config();

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

const path = require('path')
const serveStatic = require('serve-static')
// to use the express module
const express = require('express')
var router = express();

var server = require("http").createServer(router);

// Authentication
var passport = require('passport');

// Parsing post requests
var bodyParser = require('body-parser');
var multer = require('multer'); 

// to use our socket.io module
var socketio = require("socket.io")()
const config = require('getconfig')
// to use the handlebars templating engine
var exphbs = require('express-handlebars');
router.engine('handlebars', exphbs({defaultLayout: 'main'}));
router.set('view engine', 'handlebars');

const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

const sharedsession = require("express-socket.io-session");

router.use(require('cookie-parser')());
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

router.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
router.use(session);
router.use(passport.initialize());
router.use(passport.session());


socketio.use(sharedsession(session, {
  autoSave:true
}));


// to listen to port 3000
// server.listen(process.env.PORT || 3000)

const Matcher = require('./matcher');
let matcher = new Matcher((id, status, partner = null) => {
  switch (status) {
    case WAITING:
      {
        // io.sockets.emit("meta", `${id} is waiting`)
        socketio.to(id).emit("waiting");
        break;
      }
    case PAIRING:
      {
        // io.sockets.emit("meta", `${id} is pairing to ${partner}`)
        socketio.to(id).emit("pairing", matcher.getUsername(partner));
        break;
      }
    case DISCONNECTED:
      {
        socketio.to(id).emit("disconnected", matcher.getUsername(partner))
      }
    default:
      {
        break;
      }
  }
})

// add callbacks to matcher
const chats = require('./controllers/chats');
matcher.addCallback(PAIRING,      chats.logConnection);
matcher.addCallback(DISCONNECTED, chats.logDisconnection);

const sockets = require('./sockets');
sockets(socketio, matcher, config)
// Require our routes
const mainRoute = require('./routes/main')
router.use('/', mainRoute);

const createUtilRoute = require('./routes/util');
const utilRoute = createUtilRoute(matcher)
router.use('/util', utilRoute);

router.use('/static', serveStatic(path.join(__dirname, 'static')));

router.use('*', mainRoute);

module.exports = {
  router,
  socketio
}