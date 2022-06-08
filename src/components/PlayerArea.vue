<template>
  <div
    class="rounded-borders shadow-1 q-my-sm q-mx-auto q-pa-md player-area"
    :style="`background-color: ${playerColor}; width: ${numberOfPlayers === 2 ? '100%' : '80%'}`"
  >
    <div class="row justify-between" style="height: 50px">
      <h6 class="q-ma-none">Player {{ playerId + 1 }}</h6>
      <h6 class="q-ma-none player-score">{{ "Score: " + this.players[this.playerId].score }}</h6>
      <div class="q-mb-md row">
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
          @click="toggleConfirmPassArea"
          :disabled="confirmPassArea"
        />
      </div>
    </div>
    <piece-selector
      @select-piece="selectPiece"
      v-if="currPlayerSelectedPieceId === -1 && confirmPassArea === false"
      :player-id="playerId"
    />
    <piece-alter @cancel-piece="selectPiece" v-if="currPlayerSelectedPieceId !== -1 && confirmPassArea === false" :player-id="playerId" />
    <confirm-pass
      v-if="confirmPassArea === true"
      @hideConfirmPassArea="toggleConfirmPassArea"
      @stopTimer="stopTimer"
      :player-id="playerId"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PieceAlter from './PieceAlter.vue';
import PieceSelector from './PieceSelector.vue';
import ConfirmPass from "./ConfirmPass.vue";
import { PLAYER_COLORS } from 'src/constants';
import Vue from 'vue';

export default Vue.extend({
  props: ['playerId'],
  components: {
    'piece-alter': PieceAlter,
    'piece-selector': PieceSelector,
    'confirm-pass': ConfirmPass,
  },
  data() {
    return {
      // For timer
      playerColor: PLAYER_COLORS[this.playerId] + '66',
      time: 0,
      timerObj: null,
      selectedPieceId: -1,
      // For Confirm Pass
      confirmPassArea: false,
    };
  },
  computed: {
    ...mapGetters('game', ['players', 'numberOfPlayers', 'timeForEachPlayer']),

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
    ...mapActions("game", ["updatePlayerOutOfGame"]),
    // For timer
    countDown() {
      this.time--;
    },
    startTimer() {
      let self = this;
      self.stopTimer();
      this.timerObj = setInterval(function () {
        self.countDown();
        // console.log(self.time);
      }, 1000);
    },
    stopTimer() {
      console.log("stop!!!!!!!!!");
      clearInterval(this.timerObj);
    },
    selectPiece(e) {
      this.selectedPieceId = e;
    },
    toggleConfirmPassArea() {
      this.confirmPassArea = !this.confirmPassArea;
    },
  },
  mounted() {
    this.time = this.timeForEachPlayer;
  },
  watch: {
    // Timerが0になったらplayerのoutOfGameをtrueに更新
    time: {
      handler(time) {
        if (time <= 0) {
          console.log(`Player${this.playerId} ran out of the time!`);
          this.updatePlayerOutOfGame({ currentPlayerId: this.playerId });
          this.stopTimer();
        }
      },
    },
  },
});
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .player-area {
    width: 100% !important;
  }
}

.player-score {
  font-size: 16px;
}

</style>
