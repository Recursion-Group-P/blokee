<template>
  <div class="row wrap room">
    <div class="row items-center justify-around" style="height: calc(100vh - 50px); width: 100%">
      <div class="col-12 col-sm-3 flex items-center">
        <replay-player-area :playerId="0" style="height: 50%" />
        <replay-player-area v-if="numberOfPlayers > 2" :playerId="2" style="height: 50%" />
      </div>

      <!-- board -->
      <div class="col-12 col-sm-4 text-center">
        <div class="full-width row justify-center items-center">
          <canvas ref="canvasRef" :width="boardSettings.width" :height="boardSettings.height" />
        </div>
        <div class="row justify-around q-mt-lg">
          <q-btn @click="handleReplay(false)" :disabled="replayIdx === 0">prev</q-btn>
          <q-btn to="/settings">back to settings</q-btn>
          <q-btn @click="handleReplay(true)" :disabled="replayIdx === replay.boardStates.length - 1"
            >next</q-btn
          >
          <q-slider class="q-mt-md" v-model="replayIdx" readonly markers :min="0" :max="this.replay.boardStates.length - 1" color="blue-grey"/>
        </div>
      </div>

      <div class="col-12 col-sm-3 flex justify-end">
        <replay-player-area :playerId="1" style="height: 50%" />
        <replay-player-area v-if="numberOfPlayers > 2" :playerId="3" style="height: 50%" />
      </div>
    </div>
  </div>
</template>

<script>
import ReplayPlayerArea from 'src/components/ReplayPlayerArea.vue';
import { PLAYER_COLORS } from 'src/constants';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    'replay-player-area': ReplayPlayerArea,
  },

  computed: {
    ...mapGetters('game', ['boardSettings', 'numberOfPlayers', 'replay']),

    gameBoard() {
      return this.replay.boardStates[this.replayIdx];
    },
  },

  data() {
    return {
      replayIdx: 0,
      currentPlayerId: 0,
      context: null,
    };
  },

  mounted() {
    const context = this.$refs.canvasRef.getContext('2d');
    if (context !== null) {
      this.context = context;
      this.drawBoard(context);
    }
  },

  methods: {
    ...mapActions('game', ['updateReplayCurrentPlayerRemainingPieces']),

    handleReplay(increment) {
      if (increment) {
        // update current player remaining pieces
        this.updateReplayCurrentPlayerRemainingPieces({
          currentPlayerId: this.currentPlayerId,
          usedPieceId: this.replay.usedPieces[this.replayIdx],
          isUsed: true,
        });

        this.currentPlayerId =
          this.currentPlayerId + 1 >= this.numberOfPlayers ? 0 : this.currentPlayerId + 1;
        this.replayIdx++;
      } else {
        this.replayIdx--;
        this.currentPlayerId =
          this.currentPlayerId - 1 < 0 ? this.numberOfPlayers - 1 : this.currentPlayerId - 1;

        // update current player remaining pieces
        this.updateReplayCurrentPlayerRemainingPieces({
          currentPlayerId: this.currentPlayerId,
          usedPieceId: this.replay.usedPieces[this.replayIdx],
          isUsed: false,
        });
      }

      this.drawBoard(this.context);
    },

    drawBoard(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      context.strokeStyle = 'white';
      context.lineWidth = 2;

      for (let i = 0; i < this.boardSettings.totalCells; i++) {
        for (let j = 0; j < this.boardSettings.totalCells; j++) {
          if (this.gameBoard[i][j] != 0) {
            context.fillStyle = PLAYER_COLORS[this.gameBoard[i][j] - 1];
            context.fillRect(
              j * this.boardSettings.cellWidth,
              i * this.boardSettings.cellWidth,
              this.boardSettings.cellWidth,
              this.boardSettings.cellWidth
            );
          } else {
            context.fillStyle = '#CDD5DF';
            context.fillRect(
              j * this.boardSettings.cellWidth,
              i * this.boardSettings.cellWidth,
              this.boardSettings.cellWidth,
              this.boardSettings.cellWidth
            );
          }

          context.strokeRect(
            j * this.boardSettings.cellWidth,
            i * this.boardSettings.cellWidth,
            this.boardSettings.cellWidth,
            this.boardSettings.cellWidth
          );
        }
      }
    },
  },
};
</script>
