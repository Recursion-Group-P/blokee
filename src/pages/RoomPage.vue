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
            <q-tab name="player3" label="player3" v-if="players.length > 2" />
            <q-tab name="player4" label="player4" v-if="players.length > 2" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="player1">
              <player-area :playerId="0" />
            </q-tab-panel>

            <q-tab-panel name="player2">
              <player-area :playerId="1" />
            </q-tab-panel>

            <q-tab-panel name="player3">
              <player-area v-if="players.length > 2" :playerId="2" />
            </q-tab-panel>

            <q-tab-panel name="player4">
              <player-area v-if="players.length > 2" :playerId="3" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <div class="row items-center justify-evenly board-area">
      <div class="col-12 col-sm-3 flex items-center gt-sm">
        <player-area :playerId="0" style="height: 50%" />
        <player-area v-if="players.length > 2" :playerId="2" style="height: 50%" />
      </div>

      <!-- board -->
      <div class="col-12 col-sm-4 text-center">
        <div class="full-width row justify-center items-center">
          <canvas
            ref="canvasRef"
            :width="boardSettings.width"
            :height="boardSettings.height"
          />
        </div>
        <h4>{{ `currentPlayerId: ` + currentPlayerId }}</h4>
        <q-btn class="q-mt-lg" to="/replay">goto replay</q-btn>
      </div>

      <div class="col-12 col-sm-3 flex justify-end gt-sm">
        <player-area :playerId="1" style="height: 50%" />
        <player-area v-if="players.length > 2" :playerId="3" style="height: 50%" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerArea from "src/components/PlayerArea.vue";
import { HORIZONTAL_DIRS, DIAG_DIRS, PLAYER_COLORS } from "src/constants";
import { mapGetters, mapActions } from "vuex";

//TODO: Placing pieces on a grid
// 1. when piece is clicked -> selectedPieceId = selected piece idx (store in player object vuex?)
// 2. use mousemove event to track x, y and render piece on canvas board
// 3. use mouseclick event to place piece -> use current x, y as center piece position
// 4. determine whether piece can be placed -> if true update gameBoard and deselect piece (delete piece from remainingPieces)

export default {
  components: {
    "player-area": PlayerArea,
  },

  computed: {
    ...mapGetters("game", [
      "timeForEachPlayer",
      "numberOfPlayers",
      "boardSettings",
      "players",
      "currentPlayerId",
    ]),

    currPlayer() {
      return this.players[this.currentPlayerId];
    },

    currPlayerSelectedPieceId() {
      return this.players[this.currentPlayerId].selectedPieceId;
    },

    gameBoard() {
      return new Array(this.boardSettings.totalCells)
        .fill(0)
        .map(() => new Array(this.boardSettings.totalCells).fill(0));
    },

    availablePlayerMoves() {
      let playerMoves = [];
      for (let i = 0; i < this.numberOfPlayers; i++) {
        let currPlayerMoves = new Array(this.boardSettings.totalCells)
          .fill(0)
          .map(() => new Array(this.boardSettings.totalCells).fill(0));
        const startPos = this.boardSettings.startingPositions[i];
        currPlayerMoves[startPos[0]][startPos[1]] = 1;
        playerMoves.push(currPlayerMoves);
      }
      return playerMoves;
    },
  },

  data() {
    return {
      isDragging: false,
      context: null,
      canvas: null,
      tab: "player1",
    };
  },

  mounted() {
    const canvas = this.$refs.canvasRef;
    const context = this.$refs.canvasRef.getContext("2d");
    if (context !== null) {
      this.context = context;
      this.canvas = canvas;
      this.drawBoard(context);

      canvas.addEventListener("mousemove", (event) => this.handleMouseMove(event));
      canvas.addEventListener("click", (event) => this.handleMouseClick(event));
    }
  },

  watch: {
    currPlayerSelectedPieceId(newVal, oldVal) {
      if (newVal === -1) {
        this.isDragging = false;
        this.drawBoard(this.context);
      } else {
        this.isDragging = true;
      }
    },
  },

  methods: {
    ...mapActions("game", [
      "setCurrentPlayerSelectedPieceId",
      "updateCurrentPlayerRemainingPieces",
      "addReplayState",
      "updateCurrentPlayerId",
    ]),

    notifyInvalid() {
      this.$q.notify({
        type: "warning",
        message: "現在のマス目にブロックを置けません！",
        timeout: 1000,
      });
    },

    changePlayerTurn() {
      // add replay state
      this.addReplayState({
        boardState: this.gameBoard.map((arr) => arr.slice()),
        usedPiece: this.currPlayerSelectedPieceId,
      });

      this.updateCurrentPlayerRemainingPieces({
        currentPlayerId: this.currentPlayerId,
      });

      this.setCurrentPlayerSelectedPieceId({
        currentPlayerId: this.currentPlayerId,
        selectedPieceId: -1,
      });

      // change player ID
      this.updateCurrentPlayerId({
        currentPlayerId: this.currentPlayerId,
      });

      this.drawBoard(this.context);
    },

    inBounds(row, col) {
      return (
        col >= 0 &&
        row >= 0 &&
        col < this.boardSettings.totalCells &&
        row < this.boardSettings.totalCells
      );
    },

    checkHorizontalDirs(row, col) {
      let isValid = true;
      for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
        let hori_i = row + HORIZONTAL_DIR[0];
        let hori_j = col + HORIZONTAL_DIR[1];
        if (this.inBounds(hori_i, hori_j)) {
          isValid =
            isValid && this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1;
        }
      }
      return isValid;
    },

    isValidMove(currPiece, row, col) {
      let isValid = false;
      let hasCorner = false;

      // check if center piece can be placed
      if (this.inBounds(row, col) && this.gameBoard[row][col] === 0) {
        isValid = this.checkHorizontalDirs(row, col);
        hasCorner = this.availablePlayerMoves[this.currentPlayerId][row][col] === 1;

        // check if other pieces can be placed
        for (let i = 0; i < currPiece.length; i++) {
          let curr_row = row + currPiece[i][0];
          let curr_col = col + currPiece[i][1];
          // all must be true for isValid to be true
          if (this.inBounds(curr_row, curr_col)) {
            isValid =
              isValid &&
              this.gameBoard[curr_row][curr_col] === 0 &&
              this.checkHorizontalDirs(curr_row, curr_col);
            hasCorner =
              hasCorner ||
              this.availablePlayerMoves[this.currentPlayerId][curr_row][curr_col] === 1;
          } else {
            return false;
          }
        }
      }

      return isValid && hasCorner;
    },

    handleMouseMove(event) {
      if (this.isDragging) {
        let mouseX = event.pageX - this.canvas.offsetLeft;
        let mouseY = event.pageY - this.canvas.offsetTop - 50;

        let cellWidth = this.boardSettings.cellWidth;
        let row = Math.floor(mouseY / cellWidth);
        let col = Math.floor(mouseX / cellWidth);

        this.drawBoard(this.context);

        if (this.inBounds(row, col)) {
          this.context.strokeStyle = "white";
          this.context.lineWidth = 2;

          let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId]
            .pieceCoords;
          this.context.fillStyle = PLAYER_COLORS[this.currentPlayerId];

          // draw center piece
          this.context.fillRect(col * cellWidth, row * cellWidth, cellWidth, cellWidth);
          this.context.strokeRect(col * cellWidth, row * cellWidth, cellWidth, cellWidth);

          // draw other pieces
          for (let i = 0; i < currPiece.length; i++) {
            // currPiece = [x, y] where x is relative row, y is relative col
            this.context.fillRect(
              col * cellWidth + currPiece[i][1] * cellWidth,
              row * cellWidth + currPiece[i][0] * cellWidth,
              cellWidth,
              cellWidth
            );
            this.context.strokeRect(
              col * cellWidth + currPiece[i][1] * cellWidth,
              row * cellWidth + currPiece[i][0] * cellWidth,
              cellWidth,
              cellWidth
            );
          }
        }
      }
    },

    handleMouseClick(event) {
      if (this.isDragging && this.currPlayerSelectedPieceId !== -1) {
        let mouseX = event.pageX - this.canvas.offsetLeft;
        let mouseY = event.pageY - this.canvas.offsetTop - 50;

        let cellWidth = this.boardSettings.cellWidth;
        let row = Math.floor(mouseY / cellWidth);
        let col = Math.floor(mouseX / cellWidth);

        let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId]
          .pieceCoords;

        if (this.isValidMove(currPiece, row, col)) {
          // place center piece
          this.gameBoard[row][col] = this.currentPlayerId + 1;

          // place other pieces
          for (let i = 0; i < currPiece.length; i++) {
            let curr_row = row + currPiece[i][0];
            let curr_col = col + currPiece[i][1];
            this.gameBoard[curr_row][curr_col] = this.currentPlayerId + 1;
          }

          // reinitialize availablePlayerMoves for current player
          this.availablePlayerMoves[this.currentPlayerId] = new Array(
            this.boardSettings.totalCells
          )
            .fill(0)
            .map(() => new Array(this.boardSettings.totalCells).fill(0));
          // recompute availablePlayerMoves for current player
          for (let i = 0; i < this.boardSettings.totalCells; i++) {
            for (let j = 0; j < this.boardSettings.totalCells; j++) {
              if (this.gameBoard[i][j] === this.currentPlayerId + 1) {
                // check all corners for each piece
                for (const DIAG_DIR of DIAG_DIRS) {
                  let canPlace = false;
                  let diag_i = i + DIAG_DIR[0];
                  let diag_j = j + DIAG_DIR[1];

                  if (
                    this.inBounds(diag_i, diag_j) &&
                    this.gameBoard[diag_i][diag_j] === 0
                  ) {
                    canPlace = this.checkHorizontalDirs(diag_i, diag_j);
                  }

                  if (canPlace) {
                    this.availablePlayerMoves[this.currentPlayerId][diag_i][diag_j] = 1;
                  }
                }
              }
            }
          }
          this.changePlayerTurn();
        } else {
          this.notifyInvalid();
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
          } else if (this.availablePlayerMoves[this.currentPlayerId][i][j] === 1) {
            context.fillStyle = "#a7adb5";
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
  },
};
</script>

<style scoped>
/* パフォーマンス向上に入れてみました（変わりないかも？）*/
canvas {
  image-rendering: optimizeSpeed;
  image-rendering: pixelated;
}

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
