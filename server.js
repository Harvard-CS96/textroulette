/* server.js
 *
 * The main server dispatcher.
 *
 */

const {
  CONN_STATUS
} = require('./constants')
const {
  WAITING,
  PAIRING,
  DISCONNECTED
} = CONN_STATUS;

const uuid = require('uuid');

// to use the express module
var app = require("express")();

// to make an http server object
var server = require("http").createServer(app);

// to use our socket.io module
var io = require("socket.io").listen(server);

const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

const sharedsession = require("express-socket.io-session");

app.use(session);

io.use(sharedsession(session, {
  autoSave:true
}));


// to listen to port 3000
server.listen(process.env.PORT || 3000)

// to serve the index.html file
app.get("/", function (req, res) {
  res.sendfile(__dirname + "/index.html")
})


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

// DB INTERRUPTION
var mongodb = require('mongodb');
var seedData = [
  {"id": 0,
    "participant_ids": [
        1,
        10
    ],
    "length": 37.6,
    "passion_voice": 10,
    "ratings": {
        "rating": 1,
        "civility": 10,
        "listening": 7,
        "attention": 5,
        "factual": 3
    },
    "ended_by": "timer"
  }
];

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://zucks:russiatoday1@ds229835.mlab.com:29835/cs-96';

mongodb.MongoClient.connect(uri, function(err, db) {

  if(err) throw err;

  /*
   * First we'll add a few songs. Nothing is required to create the
   * songs collection; it is created automatically when we insert.
   */

  var conversations = db.collection('conversations');

   // Note that the insert method can take either an array or a dict.

  conversations.insert(seedData, function(err, result) {
    if(err) throw err;

  });
});
console.log('ran db');


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
  if (!user_id) {
    socket.handshake.session.user_id = uuid();
    socket.handshake.session.save();
  }

  socket.on("send message", function (data) {

    // socket will send messages to every single user
    // io.sockets.emit("new message", `${socket.id}: ${data}`);
    socket.emit("new message", `You said: ${data}`)
    socket.broadcast.to(matcher.getPartner(socket.id)).emit("new message", `${matcher.getUsername(socket.id)} says: ${data}`)

  })

  socket.on("set username", username => {
    matcher.connect(socket.id, username, socket.handshake.session.user_id);
    socket.handshake.session.username = username;
    socket.handshake.session.save();
    socket.emit('recall username', username)
  })

  socket.on("disconnect", () => {
    matcher.disconnect(socket.id);
  })

})

app.get('/connections', (req, res) => {
  res.end(matcher.prettyPrint())
})
