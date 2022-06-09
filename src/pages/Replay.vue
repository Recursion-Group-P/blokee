<template>
  <div class="row wrap room">

    <div class="q-pa-md q-mx-auto lt-md">
      <div class="q-gutter-y-md" style="max-width: 400px">
        <q-card flat>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="player1" label="player1" />
            <q-tab name="player2" label="player2" />
            <q-tab name="player3" label="player3" v-if="numberOfPlayers > 2" />
            <q-tab name="player4" label="player4" v-if="numberOfPlayers > 2" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="player1">
              <replay-player-area :playerId="0" />
            </q-tab-panel>

            <q-tab-panel name="player2">
              <replay-player-area :playerId="1" />
            </q-tab-panel>

            <q-tab-panel name="player3">
              <replay-player-area v-if="numberOfPlayers > 2" :playerId="2" />
            </q-tab-panel>

            <q-tab-panel name="player4">
              <replay-player-area v-if="numberOfPlayers > 2" :playerId="3" />
            </q-tab-panel>
          </q-tab-panels>

        </q-card>
      </div>
    </div>

    <div class="row items-center justify-around board-area">
      <div class="col-12 col-sm-3 flex items-center gt-sm">
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
          <q-slider class="q-my-md" v-model="replayIdx" readonly markers :min="0" :max="this.replay.boardStates.length - 1" color="blue-grey"/>
        </div>
      </div>

      <div class="col-12 col-sm-3 flex justify-end gt-sm">
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
      tab: 'player1',
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
<style>
  .board-area{
    width: 100%;
  }
  @media screen and (min-width:1023px) {
    .board-area{
      height: calc(100vh - 50px);
    }
  }
  </style>
