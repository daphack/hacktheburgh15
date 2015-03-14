function Socket (url, port){
    this.connection = new WebSocket("ws://" + url + ":" + port);

    //on open on the connection
    this.connection.onopen = function(){

    };
    // closes the connection
    this.connection.onclose = function(){

    }
    //received a message from the server
    this.connection.onmessage = function(){

    };
}
//sends the
Socket.prototype.send = function (message){
    this.connection.Send(JSON.stringify(message));
}
