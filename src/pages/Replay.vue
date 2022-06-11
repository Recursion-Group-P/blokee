<template>
  <div class="row wrap room">
    <div class="q-pa-sm q-mx-auto lt-md">
      <div class="q-gutter-y-md" style="max-width: 400px">
        <q-tab-panels swipeable v-model="tab" animated style="background-color: #f2f4f7">
          <q-tab-panel name="0">
            <replay-player-area :playerId="0" />
          </q-tab-panel>

          <q-tab-panel name="1">
            <replay-player-area :playerId="1" />
          </q-tab-panel>

          <q-tab-panel name="2">
            <replay-player-area v-if="numberOfPlayers > 2" :playerId="2" />
          </q-tab-panel>

          <q-tab-panel name="3">
            <replay-player-area v-if="numberOfPlayers > 2" :playerId="3" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <div class="row items-center justify-evenly board-area">
      <div class="col-12 col-sm-3 flex items-center gt-sm">
        <replay-player-area class="q-mb-md" :playerId="0" style="height: 50%" />
        <replay-player-area
          v-if="numberOfPlayers > 2"
          :playerId="2"
          style="height: 50%"
        />
      </div>

      <!-- board -->
      <div class="col-12 col-sm-4 text-center">
        <div class="full-width row justify-center items-center">
          <canvas
            ref="replayCanvasRef"
            :width="boardSettings.width"
            :height="boardSettings.height"
          />
        </div>
        <div class="row justify-around q-mt-lg" style="touch-action: manipulation">
          <q-btn
            @click="handleReplay(false)"
            :disabled="replayIdx === 0"
            icon="fa-solid fa-backward"
          ></q-btn>
          <q-btn
            v-if="!isPlaying"
            @click="playReplay"
            icon="fa-solid fa-play"
            color="blue-grey"
          ></q-btn>
          <q-btn
            v-else
            @click="stopReplay"
            icon="fa-solid fa-pause"
            color="warning"
          ></q-btn>
          <q-btn
            @click="handleReplay(true)"
            :disabled="replayIdx === replay.boardStates.length - 1"
            icon="fa-solid fa-forward"
          ></q-btn>
          <q-slider
            class="q-mt-md"
            v-model="replayIdx"
            readonly
            markers
            :min="0"
            :max="this.replay.boardStates.length - 1"
            color="blue-grey"
            style="max-width: 80%"
          />
        </div>
      </div>

      <div class="col-12 col-sm-3 flex justify-end gt-sm">
        <replay-player-area class="q-mb-md" :playerId="1" style="height: 50%" />
        <replay-player-area
          v-if="numberOfPlayers > 2"
          :playerId="3"
          style="height: 50%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ReplayPlayerArea from "src/components/ReplayPlayerArea.vue";
import { PLAYER_COLORS } from "src/constants";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    "replay-player-area": ReplayPlayerArea,
  },

  computed: {
    ...mapGetters("game", ["boardSettings", "numberOfPlayers", "replay"]),

    gameBoard() {
      return this.replay.boardStates[this.replayIdx];
    },
  },

  data() {
    return {
      replayIdx: 0,
      currentPlayerId: 0,
      context: null,
      tab: "0",
      interval: null,
      isPlaying: false,
    };
  },

  mounted() {
    const context = this.$refs.replayCanvasRef.getContext("2d");
    if (context !== null) {
      this.context = context;
      this.drawBoard(context);
    }
  },

  methods: {
    ...mapActions("game", ["updateReplayCurrentPlayerRemainingPieces"]),

    handleReplay(increment) {
      if (increment) {
        if (this.replayIdx < this.replay.boardStates.length - 1) {
          // update current player remaining pieces
          this.updateReplayCurrentPlayerRemainingPieces({
            currentPlayerId: this.currentPlayerId,
            usedPieceId: this.replay.usedPieces[this.replayIdx],
            isUsed: true,
          });

          this.currentPlayerId =
            this.currentPlayerId + 1 >= this.numberOfPlayers
              ? 0
              : this.currentPlayerId + 1;
          this.tab = this.currentPlayerId.toString();
          this.replayIdx++;
        }
      } else {
        if (this.replayIdx > 0) {
          this.replayIdx--;
          this.currentPlayerId =
            this.currentPlayerId - 1 < 0
              ? this.numberOfPlayers - 1
              : this.currentPlayerId - 1;
          this.tab = this.currentPlayerId.toString();

          // update current player remaining pieces
          this.updateReplayCurrentPlayerRemainingPieces({
            currentPlayerId: this.currentPlayerId,
            usedPieceId: this.replay.usedPieces[this.replayIdx],
            isUsed: false,
          });
        }
      }

      this.drawBoard(this.context);
    },

    drawBoard(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      context.strokeStyle = "white";
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
            context.fillStyle = "#CDD5DF";
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

    playReplay() {
      if (this.replayIdx === this.replay.boardStates.length - 1) {
        this.stopReplay();
        return;
      }
      if (!this.interval) {
        this.isPlaying = true;
        this.interval = setInterval(() => {
          this.handleReplay(true);
          this.playReplay();
        }, 1000);
      }
    },

    stopReplay() {
      this.isPlaying = false;
      clearInterval(this.interval);
      this.interval = null;
    },
  },
};
</script>

<style>
.room {
  position: relative;
}
.board {
  position: absolute;
  top: 5%;
  left: 28%;
}
.board-area {
  width: 100%;
}
@media screen and (min-width: 1023px) {
  .board-area {
    height: calc(100vh - 50px);
  }
}
</style>
