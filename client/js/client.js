function Socket (url, port){
    this.connection = new WebSocket("ws://" + url, "echo-protocol");

    //on open on the connection
    this.connection.onopen = function(){
        //key value pair [funtion name ] => Arguments
        var init = {
            'startgame' : true
        };
        this.send(init);

    };
    // closes the connection
    this.connection.onclose = function(){

    };
    //received a message from the server
    this.connection.onmessage = function(e){
        //call another function which shows the information
        //showCards(e.data);

	    console.log(e.data);
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
    this.connection.Send(cards);
}
//submit answer
Socket.prototype.submitAnswer = function(tick, cap){
    var answer = {
        'function' : 'answer',
        'score' : cap,
        'answer' : tick
    };
    this.connection.Send(answer);
}
//create player
Socket.prototype.createPlayer = function(url){
    var player = {
        'function' : 'createplayer',
        'createplayer' : url
    };
    this.connection.Send(player);
}
