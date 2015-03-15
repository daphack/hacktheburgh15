function Socket (url, port){
    this.connection = new WebSocket("ws://" + url, "echo-protocol");
    var that = this;

    //on open on the connection
    this.connection.onopen = function(){
        //key value pair [funtion name ] => Arguments
        var init;
        if (isHost){
            init = {
                'function' : 'startgame',
            };
        } else {
            init = {
                'function' : 'createplayer',
                'game' : gameQuery
            };
        }

        this.send(JSON.stringify(init));
        game = new Game();
    };
    // closes the connection
    this.connection.onclose = function(){

    };
    //received a message from the server
    this.connection.onmessage = function(e){
        //call another function which shows the information
        //showCards(e.data);
        var data;
        try {
            data = JSON.parse(e.data);
            if ("function" in data){
                if (data.function === "startgame"){
                    //parse the start game function
                    game.start(data.url);


                } else if (data.function === "getcards"){
                    //show the cards
                    game.showCards(data.cards);
                } else if (data.function === 'createplayer'){
                    //send update to every player in the team to let them know how many have joined

                    game.updatePlayers(data.count);
                } else if (data.function === "selectmetric"){
                    //when go is clicked
                    game.setMetric(data.metric);
                } else if (data.function === 'selectwinner'){
                    var winnerTick = data.wintick;
                    game.checkIfWinner(winnerTick);
                }
            }
        } catch (e){
            //console.log(e);
        }
        //console.log(e.data);
        console.log(data);


    };
}
//sends the
//Socket.prototype.send = function (message){
//    this.connection.Send(JSON.stringify(message));
//}
//get cards
Socket.prototype.getCards = function(){
    var cards = {
        'function' : 'getcards'
    };
    this.connection.send(JSON.stringify(cards));
}
//submit answer
Socket.prototype.submitAnswer = function(tick, cap){
    var answer = {
        'function' : 'answer',
        'answer' : cap,
        'tick' : tick,
        'game' : game.id
    };
    this.connection.send(JSON.stringify(answer));
}
//create player
Socket.prototype.createPlayer = function(url){
    var player = {
        'function' : 'createplayer',
        'createplayer' : url,
        'game' : game.id
    };
    this.connection.send(JSON.stringify(player));
}
Socket.prototype.selectMetric = function(){
    var metric = {
        'function' : 'selectmetric',
        'game' : game.id
    };
    this.connection.send(JSON.stringify(metric));
}
