/*
* Game Constructor, sets a few basic settings about the game here
*/
function Game(){
    this.id = "";
    this.metric = "";
    this.tick = "";
}
/**
* Called when the onmessage function is called in the websockets object
* Updates the card div every with all the data which is passed in
* @param JSON object from the server of the card.
*/
Game.prototype.showCards = function(data){
    //loops through the cards and ouputs the information to the screen
    //parses the json object passed in.

    console.log(data);

    loadedImages = 0;

    $('.cards-card').each(function(i) {
        $(this).find(".cards-card-title .name").text(data[i].tick);
        $(this).data("tick", data[i].tick);

        getImage(data[i].tick, this);
        $(this).find(".cards-card-data-group #cap").text(data[i].cap);
        $(this).find(".cards-card-data-group #price").text(data[i].price);
        $(this).find(".cards-card-data-group #change").text(data[i].change);

    });
    /*$('.loading').hide();
    $('.share').hide(); $('.play').show();*/
}
/**
* Gets all the cards for the hand, maximum of 5
*/
Game.prototype.getCards = function(){
    socket.getCards();
};
/**
* Starts the game
* Sets the URL value to be the game ID
* @param the game ID.
*/
Game.prototype.start = function(id){
    this.id = id;
    var value = $('.share .share-url').val();
    $('.share .share-url').attr("value", value + "?g=" + this.id);
};
/**
* Request from the server which will update the players total on the second screen
* @param the count of the players
*/
Game.prototype.updatePlayers = function(count){
    if (parseInt(count) >= 2){
        $('.share-button-go').prop('disabled', false);
        $('.share-button-go').click(getMetric);
    }
    $('.share .share-count').text(count);
};
/**
* Set which option we're going for as the highest value
* @param is the metric string representation of this.
*/
Game.prototype.setMetric = function (metric){
    this.metric = metric;
    console.log("metric" + metric);
    $('.play .metric-phrase .metric').text(metric);
};
/**
* Sets the tickets shortcode tick
* @param is the tick shortcode
*/
Game.prototype.setTick = function (tick){
    this.tick = tick;
};
/**
* Checks the response from the web server to see if the matching tick is the same
* as the users, if so they win.
* @param the tick returned from the server, which was the winner.
*/
Game.prototype.checkIfWinner = function (tick){
    console.log(tick);
    console.log(this.tick);
    if (this.tick && this.tick === tick){
        $('.result').children('.result-heading').text("Winner");
    } else {
        $('.result').children('.result-heading').text("Loser");
    }

    $('.result').show();

};
/**
* Called when the timer has ran out
*/
Game.prototype.end = function(){
    socket.end();
};
/**
* Get the image based on the name from the JSON result
* Uses jQuery to Change the src attribute to the image.
* @param name is the name of the card
* @param cards is a reference to which card we want to update
*/
function getImage(name, cards){
    var url = "";
    var that = cards;
    $.ajax({
        dataType: 'jsonp',
        url: 'http://ajax.googleapis.com/ajax/services/search/images',
        data: {
            v: "1.0",
            rsz: 1,
            q: name + " logo"
        }
    }).done(function (data){
        var result = data.responseData.results;

        $.each(result, function (){
            $(that).find('.cards-card-image').attr('src', this.url);
        });



        loadedImages++;

        if(loadedImages == 5) {
            $('.loading').hide();
            $('.share').hide(); $('.play').show();
            initTimer();

        }
    });
}
