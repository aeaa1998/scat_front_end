
import Registration from "@protocol/registration"
import Hand from "@protocol/hand"
import WebsocketResolver from "@protocol/WebsocketResolver"
import Chat from "../../protocol/chats"
import router from '../../router'
import { ASK_FOR_CARD_PAYLOAD, ROOM_START, DISCARD_CARD_PAYLOAD, LOGOUT_PAYLOAD, PLAY_HAND_PAYLOAD } from "@protocol/constants"

const state = () => ({
    username: null,
    room: null,
    hand: null,
    client: null,
    websocket: null,
    connectedToSocket: false,
    logged: false,
    failedToConnectRoom: false,
    websocketResolver: new WebsocketResolver(),
    isAskingForCard: 0,
    playedHand: null,
    winner: null,
    canEndTurn: false
})

const getters = {
    username: ({ username }) => {
        return username
    },
    isCurrentTurn: ({ client, room }) => {
        return client.order == room.currentTurn
    },
    websocket: ({ websocket }) => websocket,
    room: ({ room }) => room,
    logged: ({ logged }) => logged,
    client: ({ client }) => client,
    winner: ({ winner }) => winner,
    canEndTurn: ({ canEndTurn }) => canEndTurn,
    isAskingForCard: ({ isAskingForCard }) => isAskingForCard,
    connectedToSocket: ({ connectedToSocket }) => connectedToSocket,
    isPlayingHand: ({ room }) => room.handTurn != null && room.handTurn != undefined
}

const types = {
    SET_USERNAME: 'setUsername',
    START_CLIENT: 'startClient',
    SEND_CHAT: 'sendChat',
    LOGOUT: 'logout',
    START_ROOM: '__room_start_update__',
    ASK_FOR_CARD: 'ask_for_card',
    DISCARD_CARD: "discard_card",
    PLAYED_HAND: "played_hand",
    RESET_GAME: "reset_game",
    END_TURN: "endTurnNow"
}

const actions = {
    endTurn({ commit }){
        commit(types.END_TURN)
    },
    resetGame({ commit }){
        commit(types.RESET_GAME)
    },
    playHand({ commit }, cards) {
        commit(types.PLAYED_HAND, cards)
    },
    askForCard({ commit }, deck) {
        commit(types.ASK_FOR_CARD, deck)
    },
    discardCard({ commit }, card) {
        commit(types.DISCARD_CARD, card)
    },
    setUsername({ commit }, { username, roomId }){
        commit(types.SET_USERNAME, { username, roomId })
    },
    sendChat({ commit }, message){
        commit(types.SEND_CHAT, message)
    },
    initClient({ commit }){
        commit(types.START_CLIENT)
    },
    startRoom({ commit }){
        commit(types.START_ROOM)
    },
    logout({ commit }) {
        commit(types.LOGOUT)
    }
}


const mutations = {
    [types.END_TURN] (state){
        state.canEndTurn = false
        state.websocket.send(END_TURN_PAYLOAD)
    },
    [types.PLAYED_HAND] (state, cards){
        state.playedHand = new Hand(cards)
        state.websocket.send(
            JSON.stringify(
                {
                    ...PLAY_HAND_PAYLOAD,
                    "cards": cards.map(c => c.toJson()),
                    "username": state.username
                }
            )
        )
        state.canEndTurn = false
    },

    [types.SET_USERNAME] (state, { username, roomId }){
        state.username = username
        const registrationPayload = new Registration(username, roomId)
        state.websocket.send(registrationPayload.dump())
    },

    [types.SEND_CHAT] (state, message){
        let chat = new Chat(state.username, message, "localhost")
        state.room.chatHistory.push(chat)
        state.websocket.send(chat.dump())
    },

    [types.START_CLIENT] (state) {
        state.websocket = new WebSocket('ws://localhost:4223/')
        state.websocket.onopen = () => {
            state.connectedToSocket = true
        }
        state.websocket.addEventListener('message', function ({ data }) {
            state.websocketResolver.resolveFromServer(data, state)
        });
        state.websocket.onerror = (event) => {
            console.log("WS error ", event)
        }
        state.websocket.onclose = (event) => {
            console.log("WS closed ", event)
        }
    },
    
    [types.LOGOUT] (state) {
        router.push("/")
        state.playedHand = null
        state.room = null
        state.hand = null
        state.client = null,
        state.connectedToSocket = false
        state.logged = false
        state.failedToConnectRoom = false
        state.username = null
        if(state.websocket){
            state.websocket.send(LOGOUT_PAYLOAD)
            state.websocket.close()
        }
        state.websocket = null
    },

    [types.START_ROOM] (state) {
        state.room.checked = true
        state.websocket.send(ROOM_START)
    },

    [types.ASK_FOR_CARD] (state, deck) {
        state.websocket.send(JSON.stringify({...ASK_FOR_CARD_PAYLOAD, "username": state.username, "deck_origin": deck}))
        state.isAskingForCard = 1
    },

    [types.DISCARD_CARD] (state, card) {
        state.client.removeCard(card)
        state.websocket.send(JSON.stringify({...DISCARD_CARD_PAYLOAD, "username": state.username, "letter": card.letter, "card_type": card.type }))
        state.isAskingForCard = 0
        state.canEndTurn = true
    },

    [types.RESET_GAME] (state){
        state.playedHand = null
        state.hand = null
        state.winner = null
        state.client.lives = 4
        state.client.cards = []
        state.room.started = false
        state.handTurn = null
        state.canEndTurn = false
        state.room.checked = false
    }
}

import VuexPersistence from 'vuex-persist'
import { END_TURN_PAYLOAD } from "../../protocol/constants"



export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    plugins: [new VuexPersistence().plugin]
  }
