var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(80, function() {});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log("Request received");

    connection.send("Handshake made");
    connection.on('message',function(message) {
        if(message.type === 'utf8') {
            connection.sendUTF("Message Receieved");

        } else {
            connection.sendUTF("Message Received in different format");
        }
    });
});
