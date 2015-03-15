var socket
/** Game events */
function chooseCard() {
    var $card = $('.cards-card.selected');
    var tick = $card.data('tick');
    var metric = game.metric;
    var score = $card.find('.cards-card-data .cards-card-data-group #' + metric).text();
    game.setTick(tick);
    console.log(metric);
    // Send tick via websockets so that it can be compared with the others and the winner returned
    socket.submitAnswer(tick, score);
    //handl
}


//TODO: Open websocket
function createWebsocket(){
    socket = new Socket("daphack.assemblyco.de:80");
    //socket.getCards();
}

/**
* Get the metric by calling the socket
*/
function getMetric(){
    socket.selectMetric();
}

function initTimer(){
    var time = 30;

    var id = setInterval(function(){
        time--;
        if (time == 0){
            clearInterval(id);
            if (isHost){
                game.end();
            }
        }
        $('.page .time').text(time);
    },1000);
}

// restart the game
function restartHandler (){
    window.location.href="index.html";
}



//TODO: Create session/connect to existing session
//TODO: Accept new users to session
//TODO: Run game
