export const LOGOUT_PAYLOAD = JSON.stringify({"__type__": "__logout__"})
export const ROOM_START = JSON.stringify({ "__type__": "__room_start_update__", "__start__": true })
export const ASK_FOR_CARD_PAYLOAD = { "__type__": "__client_turn__", "type": "pull_card" }
export const DISCARD_CARD_PAYLOAD = { "__type__": "__client_turn__", "type": "discard_card" }
export const PLAY_HAND_PAYLOAD = { "__type__": "__client_turn__", "type": "present_hand" }
export const END_TURN_PAYLOAD = JSON.stringify({ "__type__": "__client_turn__", "type": "end_turn" })