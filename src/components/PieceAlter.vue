<template>
  <div style="width: 100%">
    <div class="row justify-around q-mb-sm">
      <q-btn filled color="blue-grey" round icon="flip" @click="flipPiece" />
      <q-btn
        filled
        color="blue-grey"
        round
        icon="fa-solid fa-rotate-left"
        @click="turnPiece90DegreeCounterClockwise"
      />
      <q-btn
        filled
        color="blue-grey"
        round
        icon="fa-solid fa-rotate-right"
        @click="turnPiece90DegreeClockwise"
      />
      <q-btn filled color="white" text-color="blue-grey" round icon="close" @click="cancelPiece" />
    </div>
    <div
      class="bg-grey-2 rounded-borders q-pa-sm row justify-center selected-piece-focus"
      :style="{ color: players[this.playerId].color }"
    >
      <canvas ref="canvas" width="330" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Platform } from 'quasar';
import Vue from 'vue';

export default Vue.extend({
  props: ['playerId'],
  computed: {
    ...mapGetters('game', ['players']),

    currPlayerSelectedPieceId() {
      return this.players[this.playerId].selectedPieceId;
    },

    startDrawCoordinate() {
      return { x: 150, y: (this.height - this.cellSize) / 2 };
    },
  },
  data() {
    return {
      height: Platform.is.desktop ? 250 : 150,
      cellSize: 30,
      pieceCoordinate: null,
    };
  },
  methods: {
    ...mapActions('game', [
      'setCurrentPlayerSelectedPieceId',
      'updateCurrentPieceCoordinateAfterFlip',
      'updateCurrentPieceCoordinateAfterRotation',
    ]),

    cancelPiece() {
      this.setCurrentPlayerSelectedPieceId({
        currentPlayerId: this.playerId,
        selectedPieceId: -1,
      });
    },

    // Draw the selected piece
    drawPiece(pieceCoordinate) {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      ctx.fillStyle = this.players[this.playerId].color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2.5;

      // Clear drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw center piece
      ctx.fillRect(
        this.startDrawCoordinate['x'],
        this.startDrawCoordinate['y'],
        this.cellSize,
        this.cellSize
      );
      ctx.strokeRect(
        this.startDrawCoordinate['x'],
        this.startDrawCoordinate['y'],
        this.cellSize,
        this.cellSize
      );

      // Draw other piece
      for (let i = 0; i < pieceCoordinate.length; i++) {
        ctx.fillRect(
          pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate['x'],
          pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate['y'],
          this.cellSize,
          this.cellSize
        );
        ctx.strokeRect(
          pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate['x'],
          pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate['y'],
          this.cellSize,
          this.cellSize
        );
      }
    },

    // Alter piece
    flipPiece() {
      // 座標の更新
      this.updateCurrentPieceCoordinateAfterFlip({
        currentPlayerId: this.playerId,
        currentPiece: this.currPlayerSelectedPieceId,
      });
      // 更新した座標でピースを描画
      this.drawPiece(this.pieceCoordinate);
    },
    turnPiece90DegreeClockwise() {
      let rotateDirection = 'cw'; // cw stands for "clock wise"
      // 座標の更新
      this.updateCurrentPieceCoordinateAfterRotation({
        currentPlayerId: this.playerId,
        rotateDirection: rotateDirection,
        currentPiece: this.currPlayerSelectedPieceId,
      });
      // 更新した座標でピースを描画
      this.drawPiece(this.pieceCoordinate);
    },
    turnPiece90DegreeCounterClockwise() {
      let rotateDirection = 'ccw'; // ccw stands for "counter clock wise"
      // 座標の更新
      this.updateCurrentPieceCoordinateAfterRotation({
        currentPlayerId: this.playerId,
        rotateDirection: rotateDirection,
        currentPiece: this.currPlayerSelectedPieceId,
      });
      // 更新した座標でピースを描画
      this.drawPiece(this.pieceCoordinate);
    },
  },
  mounted() {
    this.pieceCoordinate =
      this.players[this.playerId].remainingPieces[this.currPlayerSelectedPieceId].pieceCoords;
    this.drawPiece(this.pieceCoordinate);
  },
});
</script>

<style>
.selected-piece-focus {
  box-shadow: inset 0 0 6px 2px;
}
</style>
