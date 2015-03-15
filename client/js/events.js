var socket
/** Game events */
function chooseCard() {
    var $card = $('.cards-card.selected');
    var tick = $card.data('tick');
    var score = $card.find('.cards-card-data .cards-card-data-group #cap').text();

    // Send tick via websockets so that it can be compared with the others and the winner returned
    socket.submitAnswer(tick, score);
    //handl
}


//TODO: Open websocket
function createWebsocket(){
    socket = new Socket("localhost:8080");
    //socket.getCards();
}

/**
* Get the metric by calling the socket
*/
function getMetric(){
    socket.selectMetric();
}



//TODO: Create session/connect to existing session
//TODO: Accept new users to session
//TODO: Run game
