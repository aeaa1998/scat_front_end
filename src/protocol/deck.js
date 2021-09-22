import Card from "@protocol/cards"
export default class Deck {
    
    constructor(cards = [], isVisible){
        this.cards = cards
        this.isVisible = isVisible
    }

    static key = "__deck__"

    static fromJson(json) {
        let cardsJson  = json["cards"]
        if(typeof cardsJson == "string"){
            cardsJson = JSON.parse(cardsJson)
        }
        let cards = cardsJson.map(card => Card.fromJson(card[Card.key]))
        return new Deck(cards, json['is_visible'])
    }
    
}