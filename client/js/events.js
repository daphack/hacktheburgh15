/** Game events */
function chooseCard() {
    var $card = $('.cards-card.selected');
    var tick = $card.data('tick');

    //TODO: Send tick via websockets so that it can be compared with the others and the winner returned

    $('.loading').show();
    console.log($card.data('tick'));
}
