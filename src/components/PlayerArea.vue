<template>
  <div class="rounded-borders shadow-1 q-ma-sm q-pa-md player-area" style="width: 100%">
    <div class="row justify-between" style="height: 50px">
      <h6 class="q-ma-none">Player {{ playerId + 1 }}</h6>
      <div>{{ this.players[this.playerId].score }}</div>
      <div class="row q-mb-md q-mr-sm">
        <q-icon name="timer" size="1.5rem"></q-icon>
        <h6 class="q-ma-none">{{ formatTime }}</h6>
      </div>
      <div>
        <q-btn
          outline
          rounded
          color="grey-7"
          size="sm"
          padding="sm md"
          label="Pass"
          @click="showConfirmPassArea"
        />
      </div>
      <div>{{ confirmPassArea }}</div>
    </div>
    <piece-selector
      @select-piece="selectPiece"
      v-if="currPlayerSelectedPieceId === -1 && confirmPassArea === false"
      :player-id="playerId"
    />
    <piece-alter
      @cancel-piece="selectPiece"
      v-if="currPlayerSelectedPieceId !== -1 && confirmPassArea === false"
      :player-id="playerId"
    />
    <confirm-pass v-if="confirmPassArea === true" @cancelPass="hideConfirmPassArea" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PieceAlter from "./PieceAlter.vue";
import PieceSelector from "./PieceSelector.vue";
import ConfirmPass from "./ConfirmPass.vue";
import Vue from "vue";

export default Vue.extend({
  props: ["playerId"],
  components: {
    "piece-alter": PieceAlter,
    "piece-selector": PieceSelector,
    "confirm-pass": ConfirmPass,
  },
  data() {
    return {
      // For timer
      time: 0,
      timerObj: null,
      selectedPieceId: -1,
      // For Confirm Pass
      confirmPassArea: false,
    };
  },
  computed: {
    ...mapGetters("game", ["players"]),

    currPlayerSelectedPieceId() {
      return this.players[this.playerId].selectedPieceId;
    },

    formatTime() {
      let min = Math.floor(this.time / 60);
      let sec = ("00" + (this.time % 60)).slice(-2);
      let formatTime = `${min}:${sec}`;
      return formatTime;
    },
  },
  methods: {
    // For timer
    countDown() {
      this.time--;
    },
    startTimer() {
      let self = this;
      self.stopTimer();
      this.timerObj = setInterval(function () {
        self.countDown();
        console.log(self.time);
        if (self.time <= 0) self.stopTimer();
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerObj);
    },
    selectPiece(e) {
      this.selectedPieceId = e;
    },
    showConfirmPassArea() {
      this.confirmPassArea = true;
    },
    hideConfirmPassArea() {
      this.confirmPassArea = false;
    },
  },
  mounted() {
    this.time = this.players[this.playerId].time;
  },
});
</script>

<style scoped>
.player-area {
  width: 50%;
}
</style>
