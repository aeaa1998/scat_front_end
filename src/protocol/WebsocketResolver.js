
import ErrorResponse from "@protocol/error"
import Card from "@protocol/cards"
import Room from "@protocol/room"
import Client from "@protocol/client"
import Vue from 'vue'
import router from "../router"
import Chat from "./chats"

let TYPE_FIELD = "__type__"
let CARD_TYPE = "card"
let CLIENT_TYPE = "client"
let ERROR_TYPE = "error"
let ROOM_FILLED = "room_filled"
let ROOM_TYPE = "room"
let CLIENT_SAVED = "client_saved"
let CLIENT_DIED = "client_died"
let CLIENT_LOGGED = "logged"
let CHAT_TYPE = "chat"
let CARD_PULLED_TYPE = "new_card"
let CLIENT_LOST_LIFE = "client_lost"
let ROOM_FINISHED = "room_finished"

export default class WebsocketResolver {
    constructor(websocket){
        this.websocket = websocket
    }

    resolveFromServer(message, state){
        
        try {
            let payload = JSON.parse(message)
            if (Array.isArray(payload)){
                
            }else{
                switch (payload[TYPE_FIELD]) {
                    case ROOM_FINISHED:
                        console.log("there is a winner")
                        state.winner = Client.fromJson(payload["__winner__"])
                        state.winner.username = payload["__winner__"]["username"]
                        break
                    case CARD_PULLED_TYPE:
                        state.client.addNewCard(payload[Card.key])
                        break
                    case ERROR_TYPE:
                        new ErrorResponse.fromJson(payload).notify()
                        break;
                    
                    case CARD_TYPE:
                        // let card = Card.fromJson(Card.key)
                        console.log("card", payload)
                        break
                    case ROOM_FILLED:
                        new ErrorResponse("El juego ya inicio").notify()
                        state.failedToConnectRoom = true
                        break
                    case ROOM_TYPE:
                        if (state.room) {
                            state.room.updateFromJson(payload[Room.key])
                        }else{
                            console.log(payload[Room.key])
                            state.room = Room.fromJson(payload[Room.key])
                        }
                        break
                    case CLIENT_TYPE:
                        if (state.client) {
                            state.client.updateFromJson(payload[Client.key])
                        }else{
                            state.client = Client.fromJson(payload[Client.key])
                        }
                        break
                    case CLIENT_LOST_LIFE:
                        state.client.lives = payload["lives"]
                        Vue.notify({
                            title: "Has perdido vidas",
                            type: "warn"
                          })
                        state.playedHand = null
                        break
                    case CLIENT_SAVED:
                        Vue.notify({
                            title: "Esta partida te has salvado",
                            type: "success"
                          })
                        state.playedHand = null
                        break
                    case CLIENT_DIED:
                        state.client.lives = 0
                        Vue.notify({
                            title: "Has perdido la partida",
                            type: "error"
                          })
                        state.playedHand = null
                        break
                    case CLIENT_LOGGED:
                        state.logged = true
                        router.push("/room")
                        break
                    case CHAT_TYPE:
                        state.room.chatHistory.push(Chat.fromJson(payload[Chat.key]) )
                        break
                    default:
                        console.log("que pedo ", payload)
                        break;
            }
            
            }
        } catch (error) {
            console.log(error)
        }
    }
}