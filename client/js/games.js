function Game(){

}
/**
* Called when the onmessage function is called in the websockets object
* Updates the card div every with all the data which is passed in
* @param JSON object from the server of the card.
*/
Game.prototype.showCards = function(){
    //TODO test data
    var data = [
            {
              "tick" : "AP",
              "name" : "apple",
              "cap" : "1",
              "price" : 300,
              "change" : 20
            },
            {
                "tick" : "A",
                "name" : "a",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            },
            {
                "tick" : "p",
                "name" : "ple",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            },
            {
                "tick" : "m",
                "name" : "amm",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            },
            {
                "tick" : "d",
                "name" : "dd",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            }
    ];
    //loops through the cards and ouputs the information to the screen
    //parses the json object passed in.
    $('.cards-card').each(function(i) {
        $(this).find(".cards-card-title .name").text(data[i].name);
        $(this).find(".cards-card-title .tick").text(data[i].tick);
        $(this).find(".cards-card-data-group #cap").text(data[i].cap);
        $(this).find(".cards-card-data-group #price").text(data[i].price);
        $(this).find(".cards-card-data-group #change").text(data[i].change);

    });
}
