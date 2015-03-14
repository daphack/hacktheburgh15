function Game(){
    this.getCards();

}
/**
* Called when the onmessage function is called in the websockets object
* Updates the card div every with all the data which is passed in
* @param JSON object from the server of the card.
*/
Game.prototype.showCards = function(data){
    //TODO test data
    /*
    var data = [
            {
              "tick" : "AP",
              "name" : "Apple",
              "cap" : "1",
              "price" : 300,
              "change" : 20
            },
            {
                "tick" : "A",
                "name" : "Google",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            },
            {
                "tick" : "p",
                "name" : "Bloomberg",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            },
            {
                "tick" : "m",
                "name" : "Twitter",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            },
            {
                "tick" : "d",
                "name" : "Facebook",
                "cap" : "1",
                "price" : 300,
                "change" : 20
            }
    ];

    */
    data = JSON.parse(data);
    console.log(data);
    //loops through the cards and ouputs the information to the screen
    //parses the json object passed in.
    $('.cards-card').each(function(i) {
        $(this).find(".cards-card-title .name").text(data[i].name);
        $(this).find(".cards-card-title .tick").text(data[i].tick);
        $(this).data("tick", data[i].tick);
        getImage(data[i].name, this);
        $(this).find(".cards-card-data-group #cap").text(data[i].cap);
        $(this).find(".cards-card-data-group #price").text(data[i].price);
        $(this).find(".cards-card-data-group #change").text(data[i].change);

    });
}
Game.prototype.getCards = function(){
    socket.getCards();
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
