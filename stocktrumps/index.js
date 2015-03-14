var WebSocketServer = require('websocket').server;
var http = require('http');
var bb = require('./bloomberg.js'); //Bloomberg api

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

                        var game = {
                            function : 'startgame',
                            url : 'lpdrog315'
                        }
                        connection.send(JSON.stringify(game));
                    }
                }
            } catch(e) {
                console.log(e);
            }
        }
    });
});
