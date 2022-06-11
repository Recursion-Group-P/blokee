<template>
  <div class="bg-grey-2 rounded-borders q-pa-md row justify-center">
    <p class="font-size-emphasize">Are you sure you want to PASS?</p>
    <p>Once you passed, you cannot place anymore for the rest of the game.</p>
    <div>
      <q-btn push color="blue-5 q-mr-sm" label="Yes" @click="pass" />
      <q-btn push color="grey-7" label="No" @click="hideConfirmPassArea" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["playerId"],
  computed: {
    ...mapGetters("game", ["currentPlayerId"]),
  },
  methods: {
    ...mapActions("game", ["updatePlayerOutOfGame", "updateCurrentPlayerId"]),

    pass() {
      this.updatePlayerOutOfGame({ currentPlayerId: this.playerId });
      this.updateCurrentPlayerId();
      this.$emit("hideConfirmPassArea");
      this.$emit("stopTimer");
    },
    hideConfirmPassArea() {
      this.$emit("hideConfirmPassArea");
    },
  },
};
</script>
<style>
.font-size-emphasize {
  font-size: 1.1rem;
}
</style>
