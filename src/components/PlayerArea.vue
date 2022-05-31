<template>
  <div
    class="rounded-borders shadow-1 q-ma-sm q-pa-md player-area"
    :class="[playerId % 2 === 0 ? 'float-right' : '']"
  >
    <div class="row justify-between" style="height: 35px">
      <h6 class="q-ma-none">Player {{ this.playerId }}</h6>
      <div class="q-mb-md row">
        <q-icon name="timer" size="1.5rem"></q-icon>
        <h6 class="q-ma-none">{{ formatTime }}</h6>
      </div>
    </div>
    <piece-selector
      @select-piece="selectPiece"
      v-if="selectedPieceId == -1"
      :initial-pieces="initialPieces"
      :player-id="playerId"
      :piece-colors="pieceColors"
    />
    <piece-alter
      @cancel-piece="selectPiece"
      v-else
      :initial-pieces="initialPieces"
      :selected-piece-id="selectedPieceId"
      :player-id="playerId"
      :piece-colors="pieceColors"
    />
  </div>
</template>

<script>
import PieceAlter from "./PieceAlter.vue";
import PieceSelector from "./PieceSelector.vue";
import Vue from "vue";
export default Vue.extend({
  components: {
    "piece-alter": PieceAlter,
    "piece-selector": PieceSelector,
  },
  props: ["playerId", "pieceColors"],
  data() {
    return {
      // For timer
      time: 600,
      timerObj: null,
      // For pieces
      initialPieces: {
        0: "C", //1
        1: "CO", //2
        2: "OCO", //3
        3: " O\nOC", //4
        4: "OCOO", //5
        5: "O\nOCO", // 6
        6: "CO\nOO", //7
        7: "CO\n OO", //8
        8: " O \nOCO", //9
        9: "O O\nOCO", //10
        10: "OO\nCO\nO", //11
        11: "OOCOO", //12
        12: "O\nOCOO", //13
        13: "  O  \n  O  \nOCO", //14
        14: "OOC\n  O\n  O", //15
        15: " O \nOCO\n O", //16
        16: " O\nOC\n OO", //17
        17: " OO\n C\nOO", //18
        18: "OOC\n  OO", //19
        19: "OO\nCO\nO", //20
        20: " O\nOCOO", //21
      },
      selectedPieceId: -1,
    };
  },
  computed: {
    formatTime() {
      let min = ("00" + Math.floor(this.time / 60)).slice(-2);
      let sec = ("00" + (this.time % 60)).slice(-2);
      let formatTime = `${min}:${sec}`;
      return formatTime;
    },
  },
  methods: {
    // for timer
    countDown() {
      this.time--;
    },
    startTimer() {
      let self = this;
      this.timerObj = setInterval(function () {
        self.countDown();
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerObj);
    },
    selectPiece(e) {
      this.selectedPieceId = e;
    },
  },
});
</script>

<style scoped>
.player-area {
  width: 50%;
}
.float-right {
  float: right;
}
</style>
