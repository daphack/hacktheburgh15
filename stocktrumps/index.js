var WebSocketServer = require('websocket').server;
var http = require('http');
var bb = require('./bloomberg-test.js'); //Bloomberg api

var games = {};

var port = process.env.PORT || 8081;
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
                        if(data.game in games) {
                            var cardObj = {
                                function : 'getcards'
                            };

                            var connections = games[data.game].connections;
                            var len = connections.length;
                            for(var x = 0; x < len; x++) {
                                var conn = connections[x];

                                (function(conn) {
                                    bb.getTickData(function(result) {
                                        var cardObj = {
                                            function: 'getcards',
                                            cards: result
                                        };

                                        conn.send(JSON.stringify(cardObj));
                                    });
                                }(conn));

                            }

                        }
                    } else if(data.function === "startgame") {

                        var url = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 8);
                        var game = {
                            function : 'startgame',
                            url : url
                        }

                        games[url] = {};
                        games[url].connections = [connection];
                        games[url].answer = {};
                        connection.send(JSON.stringify(game));

                    } else if(data.function === "createplayer") {
                        if(data.game in games) {
                            var currentLen = games[data.game].connections.length;

                            if(currentLen < 8 && !('isPlaying' in games[data.game])) {
                                games[data.game].connections.push(connection);

                                var len = games[data.game].connections.length;

                                var countObj = {
                                    function: 'createplayer',
                                    count: len
                                }

                                var connections = games[data.game].connections;

                                for(var x = 0; x < len; x++) {
                                    var conn = connections[x];
                                    conn.send(JSON.stringify(countObj));
                                }
                            }
                        }
                    } else if(data.function === "answer") {

                        console.log(data);
                        if(data.game in games) {

                            games[data.game].answer[data.tick] = data.answer;

                            var answers = games[data.game].answer;

                            console.log(answers);
                            if(Object.keys(answers).length === games[data.game].connections.length) {
                                var winner = "";
                                var max = 0;
                                for(var key in answers) {
                                    if(parseFloat(answers[key]) > max) {
                                        winner = key;
                                        max = parseFloat(answers[key]);
                                    }
                                }

                                if(winner) {
                                    var winningObj = {
                                        function: 'selectwinner',
                                        wintick: winner
                                    };

                                    console.log(data);
                                    var connections = games[data.game].connections;
                                    var len = connections.length;

                                    for(var x = 0; x < len; x++) {
                                        var conn = connections[x];
                                        conn.send(JSON.stringify(winningObj));
                                    }

                                }
                            }
                        }
                    } else if(data.function === "selectmetric") {
                        console.log("Metric:");
                        console.log(data);
                        if('game' in data && data.game in games) {
                            if(games[data.game].connections.length >= 2) {
                                var num = Math.floor(Math.random() * 3);
                                console.log(num);
                                var metrics = ["cap", "change", "price"];

                                var metricObj = {
                                    function: 'selectmetric',
                                    metric: metrics[num]
                                };
                                console.log(metricObj);
                                var connections = games[data.game].connections;
                                var len = connections.length;
                                for(var x =0; x < len; x++) {
                                    var conn = connections[x];
                                    conn.send(JSON.stringify(metricObj));
                                }

                                games[data.game].isPlaying = true;
                            }
                        }
                    } else if(data.function === "end") {
                        if(data.game in games) {
                            var answers = games[data.game].answer;

                            var winner = "";
                            var max = 0;
                            for(var key in answers) {
                                if(parseFloat(answers[key]) > max) {
                                    winner = key;
                                    max = parseFloat(answers[key]);
                                }
                            }

                            var winningObj = {
                                function: 'selectwinner',
                                wintick: winner
                            };

                            var connections = games[data.game].connections;
                            var len = connections.length;

                            for(var x = 0; x < len; x++) {
                                var conn = connections[x];
                                conn.send(JSON.stringify(winningObj));
                            }

                        }
                    } else if(data.function === "clearanswers") {
                        if(data.game in games) {
                            games[data.game].answer = {};
                        }
                    }

                }
            } catch(e) {
                console.log(e);
            }
        }
    });
});
