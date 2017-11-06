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

const uuid = require('uuid');

// to connect to the database and instantiate the data models
var db = require('./db/connect');

// to use the express module
var app = require("express")();

var server = require("http").createServer(app);

// Authentication
var passport = require('passport');

// Parsing post requests
var bodyParser = require('body-parser');
var multer = require('multer'); 

// to use our socket.io module
var io = require("socket.io").listen(server);

// to use the handlebars templating engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
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
let matcher = new Matcher((id, status, partner = null) => {
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
        io.to(id).emit("pairing", matcher.getUsername(partner));
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
const logging = require('./controllers/logging');
matcher.addCallback(PAIRING,      logging.logConnection);
matcher.addCallback(DISCONNECTED, logging.logDisconnection);

// when a user connects to the socket
io.sockets.on("connection", function (socket) {
  // when socket receives a message from a user, the (data) parameter
  // is the message the user send

  let { user_id, username } = socket.handshake.session;
  if (!username) {
    socket.emit('request username')
  } else {
    socket.emit('recall username', username)
    matcher.connect(socket.id, username, user_id);
  }

  socket.on("send message", function (data) {
    socket.emit("new message", `You said: ${data}`)
    socket.broadcast.to(matcher.getPartner(socket.id)).emit("new message", 
      `${matcher.getUsername(socket.id)} says: ${data}`
      )

  })

  socket.on("set user", ({ username, user_id }) => {
    matcher.connect(socket.id, username, user_id);
    socket.handshake.session.username = username;
    socket.handshake.session.save();
    socket.emit('recall username', username)
  })

  socket.on("disconnect", () => {
    matcher.disconnect(socket.id);
  })

  socket.on("hangup", () => {
    matcher.hangup(socket.id);
  })

  socket.on("logout", () => {
    delete socket.handshake.session.user_id;
    delete socket.handshake.session.username;
    socket.handshake.session.save()
    matcher.disconnect(socket.id)
  })

})

// Require our routes
const mainRoute = require('./routes/main')
app.use('/', mainRoute);

const createUtilRoute = require('./routes/util');
const utilRoute = createUtilRoute(matcher)
app.use('/util', utilRoute);
