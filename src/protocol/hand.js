export default class Hand {
    constructor(cards){
        this.cards = cards
        if(cards.length == 1){
            this.value = cards[0].value
        }else{
            const letter = cards[0].letter
            if(cards.length == 3 && cards.every(card => card.letter == letter)){
                this.value = 30
            }else{
                this.value = cards.reduce((carry, card) => carry + card.value, 0)
            }
        }
    }
}