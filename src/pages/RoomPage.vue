<template>
  <div class="row wrap room">
    <div class="row items-center" style="height: calc(100vh - 50px)">
      <div class="col-12 col-sm-3 flex">
        <player-area :playerId="0" />
        <player-area v-if="players.length > 2" :playerId="2" />
      </div>

      <!-- board -->
      <div class="col-12 col-sm-6 text-center">
        <div class="full-width row justify-center items-center">
          <canvas ref="canvasRef" :width="boardSettings.width" :height="boardSettings.height" />
        </div>
        <h4>
          Player {{ currentPlayerId + 1 }}: Selected Piece ID = ({{ currPlayerSelectedPieceId }})
        </h4>
        <button @click="changePlayer">change player</button>
      </div>

      <div class="col-12 col-sm-3 flex justify-end">
        <player-area :playerId="1" />
        <player-area v-if="players.length > 2" :playerId="3" />
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
    ...mapGetters('game', [
      'timeForEachPlayer',
      'numberOfPlayers',
      'boardSettings',
      'players',
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
  },

  data() {
    return {
      currentPlayerId: 0,
      isDragging: false,
      context: null,
    };
  },

  mounted() {
    console.log(this.gameBoard);

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
          let totalCells = this.boardSettings.totalCells;
          let row = Math.floor(mouseX / cellWidth);
          let col = Math.floor(mouseY / cellWidth);

          this.drawBoard(context);

          if (col >= 0 && row >= 0 && col <= totalCells && row <= totalCells) {
            // console.log('row: ' + row + ' col: ' + col);
            // console.log(mouseX, mouseY);
            if (
              mouseX >= row * cellWidth &&
              mouseY >= col * cellWidth &&
              mouseX <= row * cellWidth + cellWidth &&
              mouseY <= col * cellWidth + cellWidth
            ) {
              // console.log(row, col)
              context.strokeStyle = 'white';
              context.lineWidth = 2;

              let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId];
              context.fillStyle = PLAYER_COLORS[this.currentPlayerId];

              // draw center piece
              context.fillRect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);
              context.strokeRect(row * cellWidth, col * cellWidth, cellWidth, cellWidth);

              // draw other pieces
              for (let i = 0; i < currPiece.length; i++) {
                // currPiece = [x, y] where x is relative row, y is relative col
                context.fillRect(
                  row * cellWidth + currPiece[i][1] * cellWidth,
                  col * cellWidth + currPiece[i][0] * cellWidth,
                  cellWidth,
                  cellWidth
                );
                context.strokeRect(
                  row * cellWidth + currPiece[i][1] * cellWidth,
                  col * cellWidth + currPiece[i][0] * cellWidth,
                  cellWidth,
                  cellWidth
                );
              }
            }
          }
        }
      };

      const handleMouseClick = (event) => {
        if (this.isDragging && this.currPlayerSelectedPieceId !== -1) {
          let mouseX = event.pageX - canvas.offsetLeft;
          let mouseY = event.pageY - canvas.offsetTop - 50;

          let cellWidth = this.boardSettings.cellWidth;
          let totalCells = this.boardSettings.totalCells;
          let row = Math.floor(mouseX / cellWidth);
          let col = Math.floor(mouseY / cellWidth);

          let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId];
          let pieceCanBePlaced = false;

          // check if piece can be placed
          if (
            col >= 0 &&
            row >= 0 &&
            col <= totalCells &&
            row <= totalCells &&
            this.gameBoard[row][col] === 0
          ) {
            pieceCanBePlaced = true;

            for (let i = 0; i < currPiece.length; i++) {
              let curr_x = row * cellWidth + currPiece[i][1] * cellWidth;
              let curr_y = col * cellWidth + currPiece[i][0] * cellWidth;
              console.log('curr_x: ' + curr_x + ' curr_y: ' + curr_y);
              let curr_row = row + currPiece[i][1];
              let curr_col = col + currPiece[i][0];
              console.log('curr_row: ' + curr_row + ' curr_col: ' + curr_col);
              if (
                curr_row >= 0 &&
                curr_col >= 0 &&
                curr_row < totalCells &&
                curr_col < totalCells &&
                this.gameBoard[curr_row][curr_col] === 0
              ) {
                pieceCanBePlaced = true;
              } else {
                pieceCanBePlaced = false;
                break;
              }
            }
          }

          if (pieceCanBePlaced) {
            console.log('piece can be placed!');
            this.gameBoard[row][col] = this.currentPlayerId + 1;

            for (let i = 0; i < currPiece.length; i++) {
              let curr_row = row + currPiece[i][1];
              let curr_col = col + currPiece[i][0];
              this.gameBoard[curr_row][curr_col] = this.currentPlayerId + 1;
            }

            this.setCurrentPlayerSelectedPieceId({
              currentPlayerId: this.currentPlayerId,
              selectedPieceId: -1,
            });
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
    ...mapActions('game', ['setCurrentPlayerSelectedPieceId']),

    changePlayer() {
      this.currentPlayerId = this.currentPlayerId === 0 ? 1 : 0;
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
              i * this.boardSettings.cellWidth,
              j * this.boardSettings.cellWidth,
              this.boardSettings.cellWidth,
              this.boardSettings.cellWidth
            );
          } else {
            context.fillStyle = '#CDD5DF';
            context.fillRect(
              i * this.boardSettings.cellWidth,
              j * this.boardSettings.cellWidth,
              this.boardSettings.cellWidth,
              this.boardSettings.cellWidth
            );
          }
          context.strokeRect(
            i * this.boardSettings.cellWidth,
            j * this.boardSettings.cellWidth,
            this.boardSettings.cellWidth,
            this.boardSettings.cellWidth
          );
        }
      }
    },

    // draw(ctx) {
    //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //   ctx.beginPath();

    //   for (let x = 0; x <= ctx.canvas.width; x += this.boardSettings.cellWidth) {
    //     ctx.moveTo(0.5 + x, 0);
    //     ctx.lineTo(0.5 + x, ctx.canvas.width);
    //   }

    //   for (let x = 0; x <= ctx.canvas.width; x += this.boardSettings.cellWidth) {
    //     ctx.moveTo(0, 0.5 + x);
    //     ctx.lineTo(ctx.canvas.width, 0.5 + x);
    //   }

    //   ctx.fillStyle = '#CDD5DF';
    //   ctx.fillRect(0, 0, this.boardSettings.width, this.boardSettings.height);
    //   ctx.strokeStyle = 'white';
    //   ctx.stroke();

    //   for (const [row, col] of this.boardSettings.startingPositions) {
    //     ctx.beginPath();
    //     const [x, y] = this.getStartingPoint(row + 0.5, col + 0.5);
    //     // arc(x, y, radius, startAngle, endAngle, counterclockwise)
    //     ctx.arc(x, y, 30 * 0.15, 0, Math.PI * 2, false);
    //     ctx.fillStyle = 'black';
    //     ctx.fill();
    //   }
    // },
    // 
    // getStartingPoint(row, col) {
    //   return [0.5 + col * 30, 0.5 + row * 30];
    // },
  },
};
</script>

<style scoped>
.room {
  position: relative;
}
.board {
  position: absolute;
  top: 5%;
  left: 28%;
  /* width: 50%; */
}
</style>
