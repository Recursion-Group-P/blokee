<template>
  <q-page class="room">
    <q-dialog v-model="gameIsOver">
      <game-over-window />
    </q-dialog>

    <div class="q-mx-auto lt-md">
      <div class="q-gutter-y-md" style="max-width: 400px">
        <q-tab-panels swipeable v-model="tab" animated style="background-color: #f2f4f7">
          <q-tab-panel class="q-pa-none q-px-sm" name="0">
            <player-area
              :playerId="0"
              :class="{ 'ai-player-area': players[0].isAI }"
              @passPlayerTurn="changePlayerTurn"
            />
          </q-tab-panel>

          <q-tab-panel class="q-pa-none q-px-sm" name="1">
            <player-area
              :playerId="1"
              :class="{ 'ai-player-area': players[1].isAI }"
              @passPlayerTurn="changePlayerTurn"
            />
          </q-tab-panel>

          <q-tab-panel class="q-pa-none q-px-sm" name="2" v-if="players.length > 2">
            <player-area
              :playerId="2"
              :class="{ 'ai-player-area': players[2].isAI }"
              @passPlayerTurn="changePlayerTurn"
            />
          </q-tab-panel>

          <q-tab-panel class="q-pa-none q-px-sm" name="3" v-if="players.length > 2">
            <player-area
              :playerId="3"
              :class="{ 'ai-player-area': players[3].isAI }"
              @passPlayerTurn="changePlayerTurn"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <div class="row items-center justify-evenly" style="width: 100%">
      <div class="col-12 col-sm-3 flex items-center gt-sm">
        <player-area
          :playerId="0"
          :class="{ 'ai-player-area': players[0].isAI }"
          style="height: 50%"
          ref="player-area-0"
          @passPlayerTurn="changePlayerTurn"
        />
        <player-area
          v-if="players.length > 2"
          :playerId="2"
          :class="{ 'ai-player-area': players[2].isAI }"
          style="height: 50%"
          ref="player-area-2"
          @passPlayerTurn="changePlayerTurn"
        />
      </div>

      <div class="col-12 col-sm-4 text-center q-pa-sm">
        <div class="full-width row justify-center items-center">
          <canvas
            ref="canvasRef"
            class="mobile-canvas"
            :width="boardSettings.width"
            :height="boardSettings.height"
          />
        </div>
      </div>

      <div class="col-12 col-sm-3 flex justify-end gt-sm">
        <player-area
          :playerId="1"
          :class="{ 'ai-player-area': players[1].isAI }"
          style="height: 50%"
          ref="player-area-1"
          @passPlayerTurn="changePlayerTurn"
        />
        <player-area
          v-if="players.length > 2"
          :playerId="3"
          :class="{ 'ai-player-area': players[3].isAI }"
          style="height: 50%"
          ref="player-area-3"
          @passPlayerTurn="changePlayerTurn"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
// Components
import PlayerArea from 'src/components/PlayerArea.vue';
import GameOverWindow from 'src/components/GameOverWindow.vue';
// Constants
import { HORIZONTAL_DIRS, DIAG_DIRS, PLAYER_COLORS } from 'src/constants';
// Vuex
import { mapGetters, mapActions } from 'vuex';
// Vue
import Vue from 'vue';
import { Platform } from 'quasar';
import { Evaluation } from 'src/model/evaluation';
// import { BONUS_POINTS } from "src/constants/index";

export default Vue.extend({
  components: {
    'player-area': PlayerArea,
    'game-over-window': GameOverWindow,
  },

  mounted() {
    const canvas = this.$refs.canvasRef;
    const context = this.$refs.canvasRef.getContext('2d');
    if (context !== null) {
      this.context = context;
      this.canvas = canvas;
      this.drawBoard(context);

      canvas.addEventListener('touchmove', (event) => this.handleTouchMove(event));
      canvas.addEventListener('touchend', (event) => this.handleTouchEnd(event));
      canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
      canvas.addEventListener('click', (event) => this.handleMouseClick(event));
    }

    if (this.currPlayer.isAI) {
      this.playAITurn(this.currPlayer);
    }
  },

  data() {
    return {
      notifyPosition: Platform.is.desktop ? 'bottom' : 'top',
      pieceSound: new Audio(require('../assets/sounds/piece.mp3')),
      showTip: true,
      isDragging: false,
      context: null,
      canvas: null,
      tab: '0',
      showModal: false,
      roomPageKey: 0,
      timeoutId: null,
    };
  },

  watch: {
    currPlayerSelectedPieceId(newVal, oldVal) {
      if (newVal === -1) {
        this.isDragging = false;
        this.drawBoard(this.context);
      } else {
        if (this.showTip) {
          const message = Platform.is.desktop
            ? 'ボード上でマウスカーソルを動かして選択したピースの配置を決め、クリックで確定します'
            : 'ボード上で指をドラッグして選択したピースの配置を決め、指を放して確定します';
          this.$q.notify({
            progress: true,
            type: 'info',
            message,
            timeout: 15000,
            closeBtn: true,
            position: this.notifyPosition,
          });
          this.showTip = false;
        }
        this.isDragging = true;
      }
    },
    currPlayerOutOfGame(newVal, oldVal) {
      if (newVal === -1) {
        this.isDragging = false;
        this.drawBoard(this.context);
      } else {
        this.isDragging = true;
      }
    },
  },

  computed: {
    ...mapGetters('game', [
      'timeForEachPlayer',
      'numberOfPlayers',
      'boardSettings',
      'players',
      'currentPlayerId',
      'currPiecePoint',
      'gameIsOver',
    ]),

    innerWidth() {
      return window.innerWidth;
    },

    currPlayer() {
      return this.players[this.currentPlayerId];
    },

    currPlayerSelectedPieceId() {
      return this.players[this.currentPlayerId].selectedPieceId;
    },

    currPlayerOutOfGame() {
      return this.players[this.currentPlayerId].outOfGame;
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

  methods: {
    ...mapActions('game', [
      'setCurrentPlayerSelectedPieceId',
      'updateCurrentPlayerRemainingPieces',
      'addReplayState',
      'updateCurrentPlayerId',
      'updateCurrentPlayerScore',
      'updateCurrentPieceCoordinateAfterRotation',
      'resetCurrentPlayer',
      'updateGameIsOver',
      'updatePlayerOutOfGame',
      'formatState',
    ]),

    notifyInvalid() {
      this.$q.notify({
        type: 'warning',
        message: '現在のマス目にブロックを置けません！',
        timeout: 1000,
        position: this.notifyPosition,
      });
    },

    playAITurn(curr_ai) {
      setTimeout(() => {
        // play AI turn and change player
        let aiCanPlacePiece = false;
        if (curr_ai.type === 'random') {
          aiCanPlacePiece = this.playRandomAITurn();
        } else if (curr_ai.type === 'medium random') {
          aiCanPlacePiece = this.playMediumRandomAITurn();
        } else {
          aiCanPlacePiece = this.playGreedyAITurn();
        }

        if (aiCanPlacePiece) {
          this.changePlayerTurn();
        } else {
          this.updatePlayerOutOfGame({ currentPlayerId: this.currentPlayerId });
          this.changePlayerTurn();
          this.$refs[`player-area-${this.currentPlayerId}`].stopTimer();
        }
        // }, Math.floor(Math.random() * (5000 - 3000)) + 3000);
      }, Math.floor(Math.random() * (500 - 300)) + 300);
    },

    changePlayerTurn() {
      if (this.players[this.currentPlayerId].outOfGame === false) {
        this.addReplayState({
          boardState: this.gameBoard.map((arr) => arr.slice()),
          usedPiece: this.currPlayerSelectedPieceId,
        });

        this.updateCurrentPlayerRemainingPieces({
          currentPlayerId: this.currentPlayerId,
        });
      }

      // reset player selected piece to -1
      this.setCurrentPlayerSelectedPieceId({
        currentPlayerId: this.currentPlayerId,
        selectedPieceId: -1,
      });

      // if entire game is over -> exit
      this.updateGameIsOver();

      // update playerId
      this.updateCurrentPlayerId();
      this.tab = this.currentPlayerId.toString();

      if (this.gameIsOver) {
        return;
      }

      this.drawBoard(this.context);

      // if next player is AI
      if (this.players[this.currentPlayerId].isAI) {
        this.playAITurn(this.players[this.currentPlayerId]);
      }
    },

    getRowColMouse(event) {
      let mouseX = event.pageX - this.canvas.offsetLeft;
      let mouseY = event.pageY - this.canvas.offsetTop - 50;
      let cellWidth = this.boardSettings.cellWidth;
      let row = Math.floor(mouseY / cellWidth);
      let col = Math.floor(mouseX / cellWidth);
      return [row, col];
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
          isValid = isValid && this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1;
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

    updateCurrentPlayerAvailableMoves(currPlayerAvailableMoves, pieceCoordsOnBoard) {
      for (const pieceCoord of pieceCoordsOnBoard) {
        const curr_row = pieceCoord[0];
        const curr_col = pieceCoord[1];

        if (currPlayerAvailableMoves[curr_row][curr_col] === 1) {
          currPlayerAvailableMoves[curr_row][curr_col] = 0;
        }

        for (const HORIZONTAL_DIR of HORIZONTAL_DIRS) {
          let hori_i = curr_row + HORIZONTAL_DIR[0];
          let hori_j = curr_col + HORIZONTAL_DIR[1];
          if (
            this.inBounds(hori_i, hori_j) &&
            this.gameBoard[hori_i][hori_j] !== this.currentPlayerId + 1 &&
            currPlayerAvailableMoves[hori_i][hori_j] === 1
          ) {
            currPlayerAvailableMoves[hori_i][hori_j] = 0;
          }
        }

        for (const DIAG_DIR of DIAG_DIRS) {
          let canPlace = false;
          let diag_i = curr_row + DIAG_DIR[0];
          let diag_j = curr_col + DIAG_DIR[1];

          if (this.inBounds(diag_i, diag_j) && this.gameBoard[diag_i][diag_j] === 0) {
            canPlace = this.checkHorizontalDirs(diag_i, diag_j);
          }

          if (canPlace) {
            currPlayerAvailableMoves[diag_i][diag_j] = 1;
          }
        }
      }
    },

    // ボードにピースを置く
    placePieceOnBoard(row, col, currPiece) {
      this.pieceSound.play();

      this.gameBoard[row][col] = this.currentPlayerId + 1;

      // place other pieces
      const pieceCoordsOnBoard = [[row, col]];
      for (let i = 0; i < currPiece.length; i++) {
        let curr_row = row + currPiece[i][0];
        let curr_col = col + currPiece[i][1];
        this.gameBoard[curr_row][curr_col] = this.currentPlayerId + 1;
        pieceCoordsOnBoard.push([curr_row, curr_col]);
      }

      // update current player available moves
      const currPlayerAvailableMoves = this.availablePlayerMoves[this.currentPlayerId];
      this.updateCurrentPlayerAvailableMoves(
        currPlayerAvailableMoves,
        pieceCoordsOnBoard,
        this.gameBoard
      );

      // 最後に１マスのピースを置く場合、ボーナス（+5pt）付与
      let evaluation = new Evaluation(this.players);
      let lastOnePieceBonus = evaluation.getLastOnePieceBonus(this.currentPlayerId);
      this.updateCurrentPlayerScore({
        currentPlayerId: this.currentPlayerId,
        currPiecePoint: currPiece.length + 1 + lastOnePieceBonus,
      });
    },

    // ボードにピースを描画する
    drawPieceOnBoard(row, col, currPiece) {
      const cellWidth = this.boardSettings.cellWidth;

      this.context.strokeStyle = 'white';
      this.context.lineWidth = 2;

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
    },

    handleMouseMove(event) {
      if (this.isDragging) {
        let [row, col] = this.getRowColMouse(event);
        let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;
        this.drawBoard(this.context);

        if (this.inBounds(row, col)) {
          this.drawPieceOnBoard(row, col, currPiece);
        }
      }
    },

    handleMouseClick(event) {
      if (this.isDragging && this.currPlayerSelectedPieceId !== -1) {
        let [row, col] = this.getRowColMouse(event);
        let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;

        if (this.isValidMove(currPiece, row, col)) {
          this.placePieceOnBoard(row, col, currPiece);
          // let evaluation = new Evaluation(this.players);
          // let lastOnePieceBonus = evaluation.getLastOnePieceBonus(this.currentPlayerId);
          // this.updateCurrentPlayerScore({
          //   currentPlayerId: this.currentPlayerId,
          //   currPiecePoint: currPiece.length + 1 + lastOnePieceBonus,
          // });

          this.changePlayerTurn();
        } else {
          this.notifyInvalid();
        }
      }

      this.drawBoard(this.context);
    },

    handleTouchMove(event) {
      event.preventDefault();

      if (this.isDragging) {
        let mouseX = event.targetTouches[0].pageX - this.canvas.offsetLeft;
        let mouseY = event.targetTouches[0].pageY - this.canvas.offsetTop - 100;
        let cellWidth = this.boardSettings.cellWidth;
        let row = Math.floor(mouseY / cellWidth);
        let col = Math.floor(mouseX / cellWidth);
        let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;

        this.drawBoard(this.context);

        if (this.inBounds(row, col)) {
          this.drawPieceOnBoard(row, col, currPiece);
        }
      }
    },

    handleTouchEnd(event) {
      event.preventDefault();

      if (this.isDragging && this.currPlayerSelectedPieceId !== -1) {
        let mouseX = event.changedTouches[0].pageX - this.canvas.offsetLeft;
        let mouseY = event.changedTouches[0].pageY - this.canvas.offsetTop - 100;

        let cellWidth = this.boardSettings.cellWidth;
        let row = Math.floor(mouseY / cellWidth);
        let col = Math.floor(mouseX / cellWidth);

        let currPiece = this.currPlayer.remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;

        if (this.isValidMove(currPiece, row, col)) {
          // place center piece
          this.placePieceOnBoard(row, col, currPiece);
          this.updateCurrentPlayerScore({
            currentPlayerId: this.currentPlayerId,
            currPiecePoint: currPiece.length + 1,
          });
          this.changePlayerTurn();
        } else {
          this.notifyInvalid();
        }
      }

      this.drawBoard(this.context);
    },

    playRandomAITurn() {
      const ai = this.players[this.currentPlayerId];
      const currPlayerAvailableMoves = this.availablePlayerMoves[this.currentPlayerId];
      const possibleMoves = ai.getRandomMoves(
        this.currentPlayerId,
        currPlayerAvailableMoves,
        this.gameBoard
      );

      for (const pieceId of ai.getRandomPieces()) {
        const currPiece = ai.remainingPieces[pieceId].pieceCoords.map((arr) => arr.slice());

        for (let i = 0; i < 4; i++) {
          for (const move of possibleMoves) {
            const row = move[0];
            const col = move[1];
            if (this.isValidMove(currPiece, row, col)) {
              this.setCurrentPlayerSelectedPieceId({
                currentPlayerId: this.currentPlayerId,
                selectedPieceId: pieceId,
              });
              this.placePieceOnBoard(row, col, currPiece);
              // this.updateCurrentPlayerScore({
              //   currentPlayerId: this.currentPlayerId,
              //   currPiecePoint: currPiece.length + 1,
              // });
              return true;
            }
          }

          // rotate
          for (let j = 0; j < currPiece.length; j++) {
            currPiece[j].splice(0, 1, -currPiece[j][0]);
            let temp = currPiece[j][0];
            currPiece[j].splice(0, 1, currPiece[j][1]);
            currPiece[j].splice(1, 1, temp);
          }
        }
      }

      return false;
    },

    playMediumRandomAITurn() {
      const ai = this.players[this.currentPlayerId];
      const currPlayerAvailableMoves = this.availablePlayerMoves[this.currentPlayerId];
      const possibleMoves = ai.getRandomMoves(
        this.currentPlayerId,
        currPlayerAvailableMoves,
        this.gameBoard
      );

      for (const pieceId of ai.getPieces()) {
        const currPiece = ai.remainingPieces[pieceId].pieceCoords.map((arr) => arr.slice());

        for (let i = 0; i < 4; i++) {
          for (const move of possibleMoves) {
            const row = move[0];
            const col = move[1];
            if (this.isValidMove(currPiece, row, col)) {
              this.setCurrentPlayerSelectedPieceId({
                currentPlayerId: this.currentPlayerId,
                selectedPieceId: pieceId,
              });
              this.placePieceOnBoard(row, col, currPiece);
              // this.updateCurrentPlayerScore({
              //   currentPlayerId: this.currentPlayerId,
              //   currPiecePoint: currPiece.length + 1,
              // });
              return true;
            }
          }

          // rotate
          for (let j = 0; j < currPiece.length; j++) {
            currPiece[j].splice(0, 1, -currPiece[j][0]);
            let temp = currPiece[j][0];
            currPiece[j].splice(0, 1, currPiece[j][1]);
            currPiece[j].splice(1, 1, temp);
          }
        }
      }

      return false;
    },

    playGreedyAITurn() {
      const ai = this.players[this.currentPlayerId];
      const currPlayerAvailableMoves = this.availablePlayerMoves[this.currentPlayerId];
      const possibleMoves = ai.getCurrentAvailableMoves(
        this.currentPlayerId,
        currPlayerAvailableMoves,
        this.gameBoard
      );

      // console.log(possibleMoves);

      const opponentAvailableMoves = this.availablePlayerMoves.filter((arr, idx) => {
        if (idx !== this.currentPlayerId) {
          return arr.slice();
        }
      });

      const weightedPlacements = [[0, null]]; // [[weight, [row, col, pieceId, currPiece]], ...]
      for (const pieceId of ai.getPieces()) {
        const currPiece = ai.remainingPieces[pieceId].pieceCoords.map((arr) => arr.slice());

        for (const move of possibleMoves) {
          const row = move[0];
          const col = move[1];

          for (let rots = 0; rots < 4; rots++) {
            if (this.isValidMove(currPiece, row, col)) {
              // increase own corners and reduce opponent corners
              let currBoardState = this.gameBoard.map((arr) => arr.slice());
              const pieceCoordsOnBoard = [[row, col]];
              currBoardState[row][col] = this.currentPlayerId + 1;
              for (let i = 0; i < currPiece.length; i++) {
                let curr_row = row + currPiece[i][0];
                let curr_col = col + currPiece[i][1];
                currBoardState[curr_row][curr_col] = this.currentPlayerId + 1;
                pieceCoordsOnBoard.push([curr_row, curr_col]);
              }

              const myCornerDiff = ai.getCornerDifference(
                this.currentPlayerId,
                currPlayerAvailableMoves,
                pieceCoordsOnBoard,
                currBoardState
              );

              let opponentCornerDiff = 0;
              for (const opponentAvailableMove of opponentAvailableMoves) {
                opponentCornerDiff += ai.getCornerDifferenceWithOpponent(
                  opponentAvailableMove,
                  pieceCoordsOnBoard
                );
              }

              // console.log(
              //   `my corner diff: ${currPlayerCornerDiff}, opponents corner diff: ${opponentCornerDiff}`
              // );

              // const weight =
              //   0.5 * currPlayerCornerDiff - 0.6 * opponentCornerDiff + 1 * (currPiece.length + 1);
              const weight =
                1 * (currPiece.length + 1) +
                ((myCornerDiff - opponentCornerDiff) / opponentAvailableMoves.length) * 0.6;

              weightedPlacements.push([
                weight,
                {
                  row,
                  col,
                  pieceId,
                  currPiece: currPiece.map((arr) => arr.slice()),
                  myCornerDiff,
                  opponentCornerDiff,
                },
              ]);
            }

            // rotate
            for (let j = 0; j < currPiece.length; j++) {
              currPiece[j].splice(0, 1, -currPiece[j][0]);
              let temp = currPiece[j][0];
              currPiece[j].splice(0, 1, currPiece[j][1]);
              currPiece[j].splice(1, 1, temp);
            }
          }
        }
      }
      const selectedPiece = weightedPlacements.sort((a, b) => b[0] - a[0])[0][1]; // row, col, pieceId, rots
      // console.log('weighted placements: ', weightedPlacements);

      if (selectedPiece) {
        // console.log(selectedPiece);
        this.setCurrentPlayerSelectedPieceId({
          currentPlayerId: this.currentPlayerId,
          selectedPieceId: selectedPiece.pieceId,
        });
        this.placePieceOnBoard(selectedPiece.row, selectedPiece.col, selectedPiece.currPiece);
        // this.updateCurrentPlayerScore({
        //   currentPlayerId: this.currentPlayerId,
        //   currPiecePoint: selectedPiece.currPiece.length + 1,
        // });
        return true;
      } else {
        // console.log('cannot place piece!');
        return false;
      }
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
            // context.fillStyle = '#a7adb5';
            context.fillStyle = this.currPlayer.color + '90';
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

    confirmSave(event) {
      event.returnValue = 'check';
    },
  },
  created() {
    window.addEventListener('beforeunload', this.confirmSave);
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.confirmSave);
  },
  beforeRouteLeave(to, from, next) {
    this.formatState();
    if (!this.gameIsOver) {
      const answer = window.confirm('進行中のゲームを終了しますか？');
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
});
</script>

<style scoped>
canvas {
  image-rendering: optimizeSpeed;
  image-rendering: pixelated;
}

.room {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.ai-player-area {
  pointer-events: none;
}

.mobile-canvas {
  margin-bottom: 20px;
}

@media screen and (min-width: 768px) {
  .room {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .mobile-canvas {
    margin-bottom: 0px;
  }
}

@media screen and (min-width: 1100px) {
  .hide-cards {
    display: none;
  }
}
</style>
