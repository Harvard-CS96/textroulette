// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const express = require('express');
const chokidar = require('chokidar');
const path = require('path')
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const emptyCache = require('require-reload').emptyCache;
const request = require('request');
const debug = require('debug');

const logHTTP = debug('http');
const logBuildClient = debug('build:client')
const logBuildServer = debug('build:server');
const logBuildError = debug('build:error');

// Initialize express app
const app = express();
const httpServer = require('http').createServer(app)
// Set app to listen on specified port
httpServer.listen(PORT, function() {
    console.log("Now listening on port " + PORT + " :)");
});

// Import webpack configuration
const config = require('./webpack/webpack.config.js');
const compiler = webpack(config);

// Server starts initially unloaded
let router = null;
let socketio = null;
let serverLoadError = "Server is not yet loaded.";

// Attempt to load the server, setting error appropriately if it fails
const loadServer = () => {
    try {
        let server = require('./server');
        router = server.router;
        socketio = server.socketio
        serverLoadError = null;
        return Promise.resolve()
    } catch (e) {
        serverLoadError = e.toString();
        router = null;
        socketio = null;
        return Promise.reject(serverLoadError)
    }
};

// Listen for change in server
const serverWatch = chokidar.watch('./server/**/*.*');
serverWatch.on('ready', () => {
    // Load the server for the first time
    loadServer()
        .then(() => {
            socketio.listen(httpServer)
        })

    // Reload the server on any change
    serverWatch.on('all', (type, path) => {
        logBuildServer("Detected change:", path)
        // Fully re-require server
        if (router !== null) {
            emptyCache(router.context);
        }
        if (socketio !== null) {
            emptyCache(socketio.context);
        }
        loadServer()
            .then(() => {
                socketio.listen(httpServer)
                logBuildServer("Reloaded server!")
            })    
            .catch(e => {
                logBuildError("Failed to reload server: " + e.toString())
            })
            
    });
});



// Add webpack middlewares
const devMiddleware = webpackDevMiddleware(compiler, {
    index: false,
    noInfo: true,
    reporter: info => {
        const { stats } = info;
        if (!stats) { 
            return;
        }
        const { compilation, startTime, endTime } = stats;
        const { errors, hash, compiler } = compilation;
        const shortHash = hash.slice(0, 6);
        const duration = endTime - startTime;
        const { fileTimestamps } = compilation;
        const changedFiles = Object.keys(fileTimestamps)
            .map(key => ([key, fileTimestamps[key]]))    
            .filter(([fname, ts]) => (ts > startTime))
            .map(([fname]) => path.relative(compiler.options.entry[compiler.options.entry.length - 1] + "/..", fname))
            
        
        if (changedFiles.length !== 0) {
            logBuildClient("Detected change: " + changedFiles.join(", "));
        }
        if (errors.length === 0) {
            logBuildClient(`Webpack built ${shortHash} in ${duration} ms.`)
        } else {
            logBuildClient(`Webpack built ${shortHash} in ${duration} ms with errors:`) 
            errors.forEach(e => {
                logBuildError(e.toString().split('\n')[0])
            })
        }
    } 
})

app.use(webpackHotMiddleware(compiler, {
    log: false,
}));
app.use(devMiddleware);
// Handle server requests
app.use((req, res, next) => {
    // If there is an error, send the error on any request
    if (serverLoadError !== null) {
        return res.status(500).end("Server load error: " + serverLoadError);
    }
    logHTTP(`HTTP ${req.method} ${req.originalUrl}`);
    router(req, res, next);
});
app.use('*', (err, req, res, next) => {
    devMiddleware(req, res, next);
});
