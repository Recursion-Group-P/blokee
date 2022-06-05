<template>
  <div class="row wrap room">
    <div class="row items-center justify-around" style="height: calc(100vh - 50px); width: 100%">
      <div class="col-12 col-sm-3 flex items-center">
        <player-area :playerId="0" style="height: 50%" />
        <player-area v-if="players.length > 2" :playerId="2" style="height: 50%" />
      </div>

      <!-- board -->
      <div class="col-12 col-sm-4 text-center">
        <div class="full-width row justify-center items-center">
          <canvas ref="canvasRef" :width="boardSettings.width" :height="boardSettings.height" />
        </div>
        <q-btn class="q-mt-lg" to="/replay">goto replay</q-btn>
      </div>

      <div class="col-12 col-sm-3 flex justify-end">
        <player-area :playerId="1" style="height: 50%" />
        <player-area v-if="players.length > 2" :playerId="3" style="height: 50%" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayerArea from 'src/components/PlayerArea.vue';
import { PLAYER_COLORS } from 'src/constants';
import { mapGetters, mapActions } from 'vuex';

//TODO: Placing pieces on a grid
// 1. when piece is clicked -> selectedPieceId = selected piece idx (store in player object vuex?)
// 2. use mousemove event to track x, y and render piece on canvas board
// 3. use mouseclick event to place piece -> use current x, y as center piece position
// 4. determine whether piece can be placed -> if true update gameBoard and deselect piece (delete piece from remainingPieces)

export default {
  components: {
    'player-area': PlayerArea,
  },

  computed: {
    ...mapGetters('game', ['timeForEachPlayer', 'numberOfPlayers', 'boardSettings', 'players']),

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
      currentPlayerId: 0,
      isDragging: false,
      context: null,
    };
  },

  mounted() {
    console.log(this.availablePlayerMoves);

    const canvas = this.$refs.canvasRef;
    const context = this.$refs.canvasRef.getContext('2d');
    if (context !== null) {
      this.context = context;
      this.drawBoard(context);

      const handleMouseMove = (event) => {
        if (this.isDragging) {
          let mouseX = event.pageX - canvas.offsetLeft;
          let mouseY = event.pageY - canvas.offsetTop - 50;

          let cellWidth = this.boardSettings.cellWidth;
          let row = Math.floor(mouseY / cellWidth);
          let col = Math.floor(mouseX / cellWidth);

          this.drawBoard(context);

          if (this.inBounds(row, col)) {
            context.strokeStyle = 'white';
            context.lineWidth = 2;

            let currPiece =
              this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;
            context.fillStyle = PLAYER_COLORS[this.currentPlayerId];

            // draw center piece
            context.fillRect(col * cellWidth, row * cellWidth, cellWidth, cellWidth);
            context.strokeRect(col * cellWidth, row * cellWidth, cellWidth, cellWidth);

            // draw other pieces
            for (let i = 0; i < currPiece.length; i++) {
              // currPiece = [x, y] where x is relative row, y is relative col
              context.fillRect(
                col * cellWidth + currPiece[i][1] * cellWidth,
                row * cellWidth + currPiece[i][0] * cellWidth,
                cellWidth,
                cellWidth
              );
              context.strokeRect(
                col * cellWidth + currPiece[i][1] * cellWidth,
                row * cellWidth + currPiece[i][0] * cellWidth,
                cellWidth,
                cellWidth
              );
            }
          }
        }
      };

      //TODO: needs refactoring
      const handleMouseClick = (event) => {
        if (this.isDragging && this.currPlayerSelectedPieceId !== -1) {
          let mouseX = event.pageX - canvas.offsetLeft;
          let mouseY = event.pageY - canvas.offsetTop - 50;

          let cellWidth = this.boardSettings.cellWidth;
          let row = Math.floor(mouseY / cellWidth);
          let col = Math.floor(mouseX / cellWidth);

          let currPiece =
            this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;

          if (this.isValidMove(currPiece, row, col)) {
            // place center piece
            this.gameBoard[row][col] = this.currentPlayerId + 1;

            // place other pieces
            for (let i = 0; i < currPiece.length; i++) {
              let curr_row = row + currPiece[i][0];
              let curr_col = col + currPiece[i][1];
              this.gameBoard[curr_row][curr_col] = this.currentPlayerId + 1;
            }

            //TODO: update available player moves
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
                  const DIAG_DIRS = [
                    [-1, -1],
                    [1, -1],
                    [-1, 1],
                    [1, 1],
                  ];
                  const HORIZONTAL_DIRS = [
                    [0, -1],
                    [0, 1],
                    [1, 0],
                    [-1, 0],
                  ];

                  for (const DIAG_DIR of DIAG_DIRS) {
                    let canPlace = false;
                    let diag_i = i + DIAG_DIR[0];
                    let diag_j = j + DIAG_DIR[1];

                    if (this.inBounds(diag_i, diag_j) && this.gameBoard[diag_i][diag_j] === 0) {
                      canPlace = true;

                      for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
                        let hori_i = diag_i + HORIZONTAL_DIR[0];
                        let hori_j = diag_j + HORIZONTAL_DIR[1];
                        if (this.inBounds(hori_i, hori_j)) {
                          canPlace =
                            canPlace && this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1;
                        }
                      }
                    }

                    if (canPlace) {
                      this.availablePlayerMoves[this.currentPlayerId][diag_i][diag_j] = 1;
                    }
                  }
                }
              }
            }

            console.log(this.availablePlayerMoves[this.currentPlayerId]);
            this.changePlayerTurn();
          } else {
            this.notifyInvalid();
          }
        }

        this.drawBoard(context);
      };

      canvas.addEventListener('mousemove', (event) => handleMouseMove(event));
      canvas.addEventListener('click', (event) => handleMouseClick(event));
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
    ...mapActions('game', [
      'setCurrentPlayerSelectedPieceId',
      'updateCurrentPlayerRemainingPieces',
      'addReplayState',
    ]),

    notifyInvalid() {
      this.$q.notify({
        type: 'warning',
        message: '現在のマス目にブロックを置けません！',
        timeout: 1000,
      });
    },

    changePlayerTurn() {
      // add replay state
      console.log('added to replay', this.gameBoard);
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
      this.currentPlayerId = (this.currentPlayerId + 1) % this.numberOfPlayers;

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

    isValidMove(currPiece, row, col) {
      const HORIZONTAL_DIRS = [
        [0, -1],
        [0, 1],
        [1, 0],
        [-1, 0],
      ];

      let isValid = false;
      let hasCorner = false;

      console.log('check if currPiece is valid');
      // check if center piece can be placed
      if (this.inBounds(row, col) && this.gameBoard[row][col] === 0) {
        isValid = true;
        for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
          let hori_i = row + HORIZONTAL_DIR[0];
          let hori_j = col + HORIZONTAL_DIR[1];
          if (this.inBounds(hori_i, hori_j)) {
            console.log(
              `hori (${hori_i}, ${hori_j}) ${
                this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1
              }`
            );
            isValid = isValid && this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1;
          }
        }
        hasCorner = this.availablePlayerMoves[this.currentPlayerId][row][col] === 1;
        console.log(`(${row}, ${col}) isValid: ${isValid}, hasCorner: ${hasCorner}`);

        // check if other pieces can be placed
        for (let i = 0; i < currPiece.length; i++) {
          let curr_row = row + currPiece[i][0];
          let curr_col = col + currPiece[i][1];
          // all must be true for isValid to be true
          console.log(curr_row, curr_col);
          if (this.inBounds(curr_row, curr_col)) {
            isValid = isValid && this.gameBoard[curr_row][curr_col] === 0;
            for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
              let hori_i = curr_row + HORIZONTAL_DIR[0];
              let hori_j = curr_col + HORIZONTAL_DIR[1];
              if (this.inBounds(hori_i, hori_j)) {
                console.log(
                  `hori (${hori_i}, ${hori_j}) ${
                    this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1
                  }`
                );
                isValid = isValid && this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1;
              }
            }
            hasCorner =
              hasCorner ||
              this.availablePlayerMoves[this.currentPlayerId][curr_row][curr_col] === 1;
            console.log(`(${curr_row}, ${curr_col}) isValid: ${isValid}, hasCorner: ${hasCorner}`);
          } else {
            return false;
          }
        }
      }

      return isValid && hasCorner;
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
          } else if (this.availablePlayerMoves[this.currentPlayerId][i][j] === 1) {
            context.fillStyle = '#a7adb5';
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
</style>
