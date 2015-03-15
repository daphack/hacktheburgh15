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
    $('.cards-card').each(function(i) {
        $(this).find(".cards-card-title .name").text(data[i].tick);
        $(this).data("tick", data[i].tick);
        getImage(data[i].tick, this);
        $(this).find(".cards-card-data-group #cap").text(data[i].cap);
        $(this).find(".cards-card-data-group #price").text(data[i].price);
        $(this).find(".cards-card-data-group #change").text(data[i].change);

    });
    $('.loading').hide();
    $('.share').hide(); $('.play').show();
}
Game.prototype.getCards = function(){
    socket.getCards();
};

Game.prototype.start = function(id){
    this.id = id;
    var value = $('.share .share-url').val();
    $('.share .share-url').attr("value", value + "?g=" + this.id);
};
Game.prototype.updatePlayers = function(count){
    if (parseInt(count) >= 2){
        $('.share-button-go').prop('disabled', false);
        $('.share-button-go').click(getMetric);
    }
    $('.share .share-count').text(count);
};
Game.prototype.setMetric = function (metric){
    this.metric = metric;
    console.log("metric" + metric);
    $('.play .metric-phrase .metric').text(metric);

};
Game.prototype.setTick = function (tick){
    this.tick = tick;
};
Game.prototype.checkIfWinner = function (tick){
    console.log(tick);
    console.log(this.tick);
    if (this.tick === tick){
        console.log("winner");

    }
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
    });
}
