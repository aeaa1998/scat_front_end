<template>
  <div uk-height-viewport class="uk-container-expand">
    <template v-if="winner == null">
      <div uk-grid>
        <div uk-height-viewport class="uk-width-3-4 uk-flex-column uk-background-secondary" id="table">
          <div class="uk-flex uk-flex-row uk-padding uk-flex-around uk-background-default">
            <template v-if="room && room.started">
              <template v-if="client && client.lives > 0">
                <img class="deck_card" :src="require(`../assets/${room.deck.cards.length > 0 ? 'back_card' : 'empty_slot'}.png`)" />
                <img class="deck_card" :src="require(`../assets/${room.visibleDeck.cards.length > 0 ? 'cards/' + room.visibleDeck.cards[0].path : 'empty_slot'}.png`)" />
              </template>
              <div v-else style="min-height: 450px">
                <h1>Has perdido</h1>
                <p>Por favor espera a que el juego termine</p>
              </div>
            </template>
            <div v-else style="min-height: 450px">
              <h1>Esperando a que todos se conecten</h1>
              <div uk-spinner></div>
            </div>
          </div>
          <div id="bottom-part" class="uk-background-secondary uk-padding-small" style="color: white">
            <div uk-grid class="uk-grid-small uk-child-width-expand@s uk-text-left">
              <div class="overflow: scroll uk-width-1-3">
                <h5 style="color: white">Cliente resumen</h5>
                <dl class="uk-description-list" v-if="client">
                  <dt style="color: white">Vidas</dt>
                  <dd style="color: white">{{ client.lives }}</dd>
                  <dt style="color: white">Es Dealer</dt>
                  <dd style="color: white">{{ `${client.isDealer ? "Eres repartidor" : "No eres repartidor"}` }}</dd>
                  <dt style="color: white">Orden</dt>
                  <dd style="color: white">{{ client.order }}</dd>
                  <dt style="color: white">Valor actual de la mano</dt>
                  <dd style="color: white">{{ currentHandValue }}</dd>
                  <dt style="color: white">Room Id</dt>
                  <dd style="color: white">{{ room.id }}</dd>
                </dl>
              </div>
              <div>
                <template v-if="room && room.started">
                  <h5 style="color: white">{{ isAskingForCard == 1 ? "Escoge una carta a descartar" : "Mano actual" }}</h5>
                  <div uk-grid class="uk-grid-small">
                    <img
                      v-for="card in client.cards"
                      :key="card.id"
                      class="hand_card"
                      :src="require(`../assets/cards/${card.path}.png`)"
                      :class="{ hand_select: isAskingForCard == 1 }"
                      @click="() => discardCardProcess(card)"
                    />
                  </div>
                  <p v-if="!isCurrentTurn">Espera a que sea tu turno para jugar</p>
                  <p v-if="isPlayingHand">RECUERDA! Solo tienes esta ronda para mejorar tu mano.</p>
                  <div v-if="!selectingDeck" class="uk-margin-top">
                    <button :disabled="!isAlive || !isCurrentTurn || canEndTurn" v-if="isAskingForCard != 1" @click="startCardProcess" class="uk-button uk-button-primary uk-margin-right">
                      Jalar carta
                    </button>
                    <button :disabled="!isAlive || !isCurrentTurn" v-if="isAskingForCard != 1" @click="() => sendHandProcess()" class="uk-button uk-button-primary uk-margin-right">Mandar mano</button>
                    <button :disabled="!isAlive || !isCurrentTurn || !canEndTurn || isPlayingHand" v-if="isAskingForCard != 1" @click="endTurn" class="uk-button uk-button-primary">
                      Finalizar turno
                    </button>
                    <button :disabled="canEndTurn" @click="logout" class="uk-button uk-button-danger uk-margin-left">Salir sesión</button>
                  </div>
                  <div v-if="selectingDeck" class="uk-margin-top">
                    <button :disabled="room.deck.cards.length == 0" @click="() => askCardProcess('deck')" class="uk-button uk-button-primary uk-modal-close uk-margin-right" type="button">
                      Jalar del Deck
                    </button>
                    <button :disabled="room.visibleDeck.cards.length == 0" @click="() => askCardProcess('visible_deck')" class="uk-button uk-button-primary uk-modal-close" type="button">
                      Jalar de los Descartes
                    </button>
                  </div>
                </template>
                <div v-else class="uk-margin-top">
                  <div class="uk-margin-bottom">Tendras tu mano una vez el juego inicie</div>
                  <button @click="startRoom" v-if="room && !room.checked" class="uk-button uk-button-primary uk-margin-right">Iniciar juego</button>
                  <button @click="logout" class="uk-button uk-button-danger">Salir sesión</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="uk-width-1-4 uk-flex uk-flex-column uk-background-muted uk-padding">
          <h2 class="uk-heading-divider chat-header">Chat</h2>
          <div
            uk-height-viewport="expand: true; offset-top: true; offset-bottom: #chat-input"
            style="max-height: 550px; overflow: scroll; height: 500px"
            class="uk-background-default uk-padding uk-panel uk-border-rounded"
          >
            <div v-if="room" class="uk-flex uk-flex-column">
              <template v-for="chat in room.chatHistory">
                <div v-if="chat.type == 'localhost'" class="uk-margin-small-bottom" :key="chat.id">
                  <div class="uk-text-left uk-text-default">{{ chat.username }}</div>
                  <div class="chat_other uk-align-left">{{ chat.message }}</div>
                </div>
                <div v-if="chat.type == 'external'" class="uk-margin-small-bottom" :key="chat.id">
                  <div class="uk-text-right uk-text-default">{{ chat.username }}</div>
                  <div class="chat_you uk-align-right">{{ chat.message }}</div>
                </div>
              </template>
            </div>
          </div>

          <div class="uk-inline uk-margin-top" id="chat-input">
            <input v-model="chat" class="uk-input" type="text" placeholder="Ingrese algo al chat..." />
            <button
              class="uk-form-icon uk-form-icon-flip"
              @click="
                () => {
                  sendChat(chat);
                  chat = null;
                }
              "
              uk-icon="icon: check"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-if="winner">
      <div uk-height-viewport class="uk-width-3-4 uk-flex-column uk-background-secondary" id="table">
        <h1 v-if="winner.username != username" style="color: white">El ganador es: {{ winner.username }}</h1>
        <h1 v-else style="color: white">TU HAS GANADO</h1>
        <p style="color: white">Si deseas jugar otra partida haz click en "otra partida" si no cierra tu sesión</p>
        <button @click="resetGame" class="uk-button uk-button-primary uk-margin-right">Otra partida</button>
        <button @click="logout" class="uk-button uk-button-danger">Salir sesión</button>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Room",
  data: () => ({
    range: (start, end) => new Array(end - start + 1).fill().map((el, ind) => ind + start),
    chat: null,
    selectingDeck: false,
  }),
  computed: {
    ...mapGetters("scat", ["room", "client", "isAskingForCard", "isCurrentTurn", "winner", "canEndTurn", "isPlayingHand", "username"]),
    isAlive() {
      return this.client && this.client.lives > 0;
    },
    currentHandValue() {
      if (!this.client) {
        return "N/A";
      }
      if (this.client.cards.length != 3) {
        return "N/A";
      }
      const cards = this.client.cards;
      const letter = cards[0].letter;
      if (cards.every((card) => letter == card.letter)) {
        return 30;
      }

      const groupedCards = cards.reduce((group, card) => {
        group[card.type] = [...(group[card.type] || []), card];
        return group;
      }, {});
      let grouped = Object.keys(groupedCards).reduce((carry, key) => {
        carry.push({ group: groupedCards[key], value: groupedCards[key].reduce((c, card) => c + card.value, 0) });
        return carry;
      }, []);
      let maxGroup = this._.maxBy(grouped, "value");

      return maxGroup.value;
    },
  },
  methods: {
    ...mapActions("scat", ["sendChat", "logout", "startRoom", "askForCard", "discardCard", "resetGame", "playHand", "endTurn"]),
    sendHandProcess() {
      const cards = this.client.cards;

      const letter = cards[0].letter;
      if (cards.every((card) => letter == card.letter)) {
        return this.playHand(cards);
      }

      const groupedCards = cards.reduce((group, card) => {
        group[card.type] = [...(group[card.type] || []), card];
        return group;
      }, {});
      let grouped = Object.keys(groupedCards).reduce((carry, key) => {
        carry.push({ group: groupedCards[key], value: groupedCards[key].reduce((c, card) => c + card.value, 0) });
        return carry;
      }, []);

      let maxGroup = this._.maxBy(grouped, "value");
      this.playHand(maxGroup.group);
    },
    startCardProcess() {
      this.selectingDeck = true;
      // select-deck
    },
    askCardProcess(deck) {
      this.selectingDeck = false;
      this.askForCard(deck);
    },
    discardCardProcess(card) {
      if (this.isAskingForCard == 1) {
        this.discardCard(card);
      }
    },
  },
};
</script>
<style scoped>
.chat_other {
  background: teal;
  color: white;
  max-width: 55%;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  border-radius: 20px;
}
.chat_you {
  background: thistle;
  color: white;
  max-width: 55%;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: right;
  border-radius: 20px;
}

.hand_select {
  cursor: pointer;
}

.hand_select:hover {
  scale: 1.3;
}

.deck_card {
  height: 400px;
}

.hand_card {
  height: 150px;
}
.pointer {
  cursor: pointer;
}
</style>