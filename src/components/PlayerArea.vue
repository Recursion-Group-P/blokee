<template>
  <div class="rounded-borders shadow-1 q-ma-sm q-pa-md player-area" style="width: 100%">
    <div class="row justify-between" style="height: 50px">
      <h6 class="q-ma-none">Player {{ playerId + 1 }}</h6>
      <div class="q-mb-md row">
        <q-icon name="timer" size="1.5rem"></q-icon>
        <h6 class="q-ma-none">{{ formatTime }}</h6>
      </div>
    </div>
    <piece-selector
      @select-piece="selectPiece"
      v-if="selectedPieceId == -1"
      :player-id="playerId"
    />
    <piece-alter
      @cancel-piece="selectPiece"
      v-else
      :selected-piece-id="selectedPieceId"
      :player-id="playerId"
    />
  </div>
</template>

<script>
import PieceAlter from './PieceAlter.vue';
import PieceSelector from './PieceSelector.vue';
import Vue from 'vue';

export default Vue.extend({
  props: ['playerId'],
  components: {
    'piece-alter': PieceAlter,
    'piece-selector': PieceSelector,
  },
  data() {
    return {
      // For timer
      time: 600,
      timerObj: null,
      selectedPieceId: -1,
    };
  },
  computed: {
    formatTime() {
      let min = ('00' + Math.floor(this.time / 60)).slice(-2);
      let sec = ('00' + (this.time % 60)).slice(-2);
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
  mounted() {
    console.log('mounted' + this.playerId)
  }
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
