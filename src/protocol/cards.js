export default class Card {

    constructor(type, letter, value){
        this.type = type
        this.letter = letter
        this.value = value
        // cardClubs2
        this.path = `card${type[0].toUpperCase()}${type.slice(1)}${letter}`
    }

    static key = "__card__"

    toJson(){
        return {
            "type": this.type,
            "letter": this.letter,
            "value": this.value,
        }
    }

    static fromJson(json) {
        return new Card(json["type"], json["letter"], json["value"])
    }
}