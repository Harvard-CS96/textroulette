// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

// Initialize server
let app = express();
let httpServer = require('http').createServer(app)

httpServer.listen(PORT, function() {
    console.log("Now listening on port " + PORT + " :)");
}) 

let server = require('./server');
let router = server.router;
let socketio = server.socketio;

// Serve built client
app.use(serveStatic('build'))

// server
socketio.listen(httpServer)
app.use(router)