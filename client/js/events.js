/** Game events */
function chooseCard() {
    var $card = $('.cards-card.selected');
    var tick = $card.data('tick');

    //TODO: Send tick via websockets so that it can be compared with the others and the winner returned

    $('.loading').show();
    console.log($card.data('tick'));
}


//TODO: Open websocket
function createWebsocket(){
    var socket = new Socket("http://stocktrumps.herokuapp.com", "5678");
}
//TODO: Create session/connect to existing session
//TODO: Accept new users to session
//TODO: Run game
