<template>
  <div uk-height-viewport class="uk-container">
    <div uk-grid class="uk-flex uk-flex-column uk-position-center uk-width-1-2">
      <template v-if="connectedToSocket">
        <h1 class="">Scat</h1>
        <div>Ingrese su nombre del usuario para poder jugar scat</div>
        <input v-model="username" class="uk-input" />
        <label><input v-model="newRoom" class="uk-checkbox uk-margin-right" type="checkbox" />Nueva sala?</label>
        <div v-if="!newRoom">Ingrese el id del room</div>
        <input v-if="!newRoom" v-model="roomId" class="uk-input" />
        <button @click.once="() => setUsername({ username, roomId })" class="uk-button uk-button-default">Ingresar</button>
      </template>

      <div v-else>
        <h2>Conectando al server</h2>
        <div uk-spinner></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",
  data: () => ({
    username: null,
    newRoom: true,
    roomId: null,
  }),
  computed: {
    ...mapGetters("scat", ["connectedToSocket", "websocket"]),
  },
  methods: {
    ...mapActions("scat", ["setUsername", "initClient"]),
    login() {},
  },
  mounted() {
    this.initClient();
    // this.$router.push("/room");
  },
};
</script>
