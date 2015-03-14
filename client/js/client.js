function Socket (url, port){
    this.connection = new WebSocket("ws://" + url, "echo-protocol");
    var that = this;

    //on open on the connection
    this.connection.onopen = function(){
        //key value pair [funtion name ] => Arguments
        var init = {
            'startgame' : true
        };
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
        var data = JSON.parse(e.data);
        //console.log(e.data);

        game.showCards(data);
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
        'score' : cap,
        'answer' : tick
    };
    this.connection.send(JSON.stringify(answer));
}
//create player
Socket.prototype.createPlayer = function(url){
    var player = {
        'function' : 'createplayer',
        'createplayer' : url
    };
    this.connection.send(JSON.stringify(player));
}
