import Card from "@protocol/cards"
export default  class Client {
    static key = "__client__"

    /**
     * 
     * @param {Int} lives The amount of remaining lives
     * @param {Array<Card>} cards The cards in the hand of the client
     * @param {Boolean} isDealer Bool to tell wether the player was the dealer
     * @param {Int} order The turn representativea
     */
    constructor(lives, cards, isDealer, order){
        this.lives = lives
        this.cards = cards
        this.isDealer = isDealer
        this.order = order
        this.username = null
    }

    removeCard(card){
        this.cards = this.cards.filter(_card => card.letter != _card.letter || card.type != _card.type)
    }

    addNewCard(json){
        let card = Card.fromJson(json)
        this.cards.push(card)
    }

    updateFromJson(json){
        let cardsJson  = json["cards"]
        if(typeof cardsJson == "string"){
            cardsJson = JSON.parse(cardsJson)
        }
        let cards = cardsJson.map(card => Card.fromJson(card[Card.key]))
        this.cards = cards
        this.order = json["order"]
        this.isDealer = json["is_dealer"]
        this.lives = json["lives"]
    }

    static fromJson(json){
        let cardsJson  = json["cards"]
        if(typeof cardsJson == "string"){
            cardsJson = JSON.parse(cardsJson)
        }
        let cards = cardsJson.map(card => Card.fromJson(card[Card.key]))
        let client = new Client(json["lives"], cards, json["is_dealer"], json["order"])
        console.log(client)
        return client
    }

}