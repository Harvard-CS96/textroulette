var uuid = require('node-uuid'),
    crypto = require('crypto');

module.exports = function(io, matcher, config) {

    io.sockets.on('connection', function(client) {

        let { user_id, username } = client.handshake.session;
        if (!username) {
          client.emit('request username')
        } else {
          client.emit('recall username', username)
        }

        client.on("send message", function (data) {
          client.emit("new message", `You said: ${data}`)
          client.broadcast.to(matcher.getPartner(client.id)).emit("new message",
            `${matcher.getUsername(client.id)} says: ${data}`
            )
        })

        client.on("set user", ({ username, user_id }) => {
          client.handshake.session.username = username;
          client.handshake.session.user_id = user_id;
          client.handshake.session.save();
          client.emit('recall username', username)
        })

        client.on("disconnect", () => {
          matcher.disconnect(client.id);
          removeFeed();
        })

        client.on("hangup", () => {
          matcher.hangup(client.id);
        })

        client.on("logout", () => {
          delete client.handshake.session.user_id;
          delete client.handshake.session.username;
          client.handshake.session.save()
          matcher.disconnect(client.id)
        })

        client.on("request match", () => {
            console.log("match requested");
            console.log("client.id " + client.id);
            console.log("client.handshake.session.username " + client.handshake.session.username);
            console.log("client.handshake.session.user_id " + client.handshake.session.user_id);
            matcher.connect(client.id, client.handshake.session.username, client.handshake.session.user_id);
        })

        client.resources = {
            screen: false,
            video: true,
            audio: false
        };

        // pass a message to another id
        client.on('message', function(details) {
            if (!details) return;

            var otherClient = io.to(details.to);
            if (!otherClient) return;

            details.from = client.id;
            otherClient.emit('message', details);
        });

        client.on('join', join);

        function removeFeed(type) {
            if (client.room) {
                io.sockets.in(client.room).emit('remove', {
                    id: client.id,
                    type: type
                });
                if (!type) {
                    client.leave(client.room);
                    client.room = undefined;
                }
            }
        }

        function join(name, cb) {
            // sanity check
            if (typeof name !== 'string') return;
            // check if maximum number of clients reached
            if (config.rooms && config.rooms.maxClients > 0 &&
                clientsInRoom(name) >= config.rooms.maxClients) {
                safeCb(cb)('full');
                return;
            }
            // leave any existing rooms
            removeFeed();
            safeCb(cb)(null, describeRoom(name));
            client.join(name);
            client.room = name;
        }

        client.on('leave', function() {
            removeFeed();
        });

        client.on('create', function(name, cb) {
            if (arguments.length == 2) {
                cb = (typeof cb == 'function') ? cb : function() {};
                name = name || uuid();
            } else {
                cb = name;
                name = uuid();
            }
            // check if exists
            var room = io.nsps['/'].adapter.rooms[name];
            if (room && room.length) {
                safeCb(cb)('taken');
            } else {
                join(name);
            safeCb(cb)(null, name);
            }
        });

        // support for logging full webrtc traces to stdout
        // useful for large-scale error monitoring
        client.on('trace', function(data) {
            console.log('trace', JSON.stringify(
                [data.type, data.session, data.prefix, data.peer, data.time, data.value]
            ));
        });


        // tell client about stun and turn servers and generate nonces
        client.emit('stunservers', config.stunservers || []);

        // create shared secret nonces for TURN authentication
        // the process is described in draft-uberti-behave-turn-rest
        var credentials = [];
        // allow selectively vending turn credentials based on origin.
        var origin = client.handshake.headers.origin;
        if (!config.turnorigins || config.turnorigins.indexOf(origin) !== -1) {
            config.turnservers.forEach(function(server) {
                var hmac = crypto.createHmac('sha1', server.secret);
                // default to 86400 seconds timeout unless specified
                var username = Math.floor(new Date().getTime() / 1000) + (parseInt(server.expiry || 86400, 10)) + "";
                hmac.update(username);
                credentials.push({
                    username: username,
                    credential: hmac.digest('base64'),
                    urls: server.urls || server.url
                });
            });
        }
        client.emit('turnservers', credentials);
    });


    function describeRoom(name) {
        var adapter = io.nsps['/'].adapter;
        var clients = adapter.rooms[name] || {};
        var result = {
            clients: {}
        };
        Object.keys(clients).forEach(function(id) {
            result.clients[id] = adapter.nsp.connected[id].resources;
        });
        return result;
    }

    function clientsInRoom(name) {
        var clients = io.nsps['/'].adapter.rooms[name];
        return clients ? Object.keys(io.nsps['/'].adapter.rooms[name]).length : 0;
    }

};

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function() {};
    }
}
