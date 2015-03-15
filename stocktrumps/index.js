var WebSocketServer = require('websocket').server;
var http = require('http');
var bb = require('./bloomberg.js'); //Bloomberg api

var games = {};

var port = process.env.PORT || 8080;
var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(port, function() {});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log("Request received");
    connection.send(JSON.stringify({ message: "Message Received" }));

    connection.on('message',function(message) {
        if(message.type === 'utf8') {
            try {
                var data = JSON.parse(message.utf8Data);

                if('function' in data && data.function !== undefined) {
                    if(data.function === "getcards") {

                        var cardObj = {
                            function : 'getcards',
                            cards: bb.getcards()

                        };
                        connection.send(JSON.stringify(cardObj));
                    } else if(data.function === "startgame") {

                        var url = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 8);
                        var game = {
                            function : 'startgame',
                            url : url
                        }

                        games[url] = {};
                        games[url].connections = [connection];
                        connection.send(JSON.stringify(game));

                    } else if(data.function === "createplayer") {
                        if(data.game in games) {
                            games[data.game].connections.push(connection);

                            var len = games[data.game].connections.length;

                            var countObj = {
                                function: 'createplayer',
                                count: len
                            }

                            console.log(len);

                            var connections = games[data.game].connections;
                            for(var x = 0; x < len; x++) {
                                var conn = connections[x];
                                conn.send(JSON.stringify(countObj));
                            }
                        }
                    }

                    //TODO: answer, createplayer
                    //TODO: handle sessions
                }
            } catch(e) {
                console.log(e);
            }
        }
    });
});
