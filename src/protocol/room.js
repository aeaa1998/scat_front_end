import { v4 } from 'uuid'
import Deck from "./deck"
export default class Room {

    static key = "__room__"

    /**
     * 
     * @param {Deck} deck The pile of cards that havent been discarded
     * @param {Deck} visibleDeck  The pile of discarded cards
     * @param {Boolean} started Boolean that tells if the room game has started
     * @param {Int} currentTurn The current turn
     * @param {Int} handTurn The current turn that first showed the hand
     */
    constructor(id, deck, visibleDeck, started, currentTurn, handTurn, startCount){
        this.id = id
        this.deck = deck
        this.visibleDeck = visibleDeck
        this.started = started
        this.currentTurn = currentTurn
        this.handTurn = handTurn
        this.startCount = startCount
        this.chatHistory = []
        this.checked = false
    }

    updateFromJson(json){
        let deck = Deck.fromJson(json["deck"][Deck.key])
        let visibleDeck = Deck.fromJson(json["visible_deck"][Deck.key])
        this.visibleDeck = visibleDeck
        this.deck = deck
        this.started = json["started"]
        this.currentTurn = json["current_turn"]
        this.handTurn = json["hand_turn"]
    }

    /**
     * 
     * @param {JSON} json Json representation from the server
     * @returns 
     */
    static fromJson(json){
        let deck = Deck.fromJson(json["deck"][Deck.key])
        let visibleDeck = Deck.fromJson(json["visible_deck"][Deck.key])
        return new Room(json["id"], deck, visibleDeck, json["started"], json["current_turn"], json["hand_turn"], json["start_count"])
    }
}