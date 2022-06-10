<template>
  <div>
    <div>
      <div class="row justify-between q-mb-sm">
        <q-btn outline color="blue-5" round icon="flip" @click="flipPiece" />
        <q-btn
          outline
          color="blue-5"
          round
          icon="rotate_90_degrees_ccw"
          @click="turnPiece90DegreeCounterClockwise"
        />
        <q-btn
          outline
          color="blue-5"
          round
          icon="rotate_90_degrees_cw"
          @click="turnPiece90DegreeClockwise"
        />
        <q-btn outline color="grey-7" round icon="close" @click="cancelPiece" />
      </div>
      <div
        class="bg-grey-2 rounded-borders q-pa-sm row justify-center selected-piece-focus"
        :style="{ color: players[this.playerId].color }"
      >
        <canvas ref="canvas" width="250" height="250"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from "vue";

export default Vue.extend({
  props: ["playerId"],
  mounted() {
    this.pieceCoordinate = this.players[this.playerId].remainingPieces[
      this.currPlayerSelectedPieceId
    ].pieceCoords;
    this.drawPiece(this.pieceCoordinate);
  },
  data() {
    return {
      cellSize: 30,
      startDrawCoordinate: { x: 110, y: 110 },
      pieceCoordinate: null,
    };
  },
  computed: {
    ...mapGetters("game", ["players"]),

    currPlayerSelectedPieceId() {
      return this.players[this.playerId].selectedPieceId;
    },
  },
  methods: {
    ...mapActions("game", [
      "setCurrentPlayerSelectedPieceId",
      "updateCurrentPieceCoordinateAfterFlip",
      "updateCurrentPieceCoordinateAfterRotation",
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
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = this.players[this.playerId].color;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2.5;

      // Clear drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw center piece
      ctx.fillRect(
        this.startDrawCoordinate["x"],
        this.startDrawCoordinate["y"],
        this.cellSize,
        this.cellSize
      );
      ctx.strokeRect(
        this.startDrawCoordinate["x"],
        this.startDrawCoordinate["y"],
        this.cellSize,
        this.cellSize
      );

      // Draw other piece
      for (let i = 0; i < pieceCoordinate.length; i++) {
        ctx.fillRect(
          pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate["x"],
          pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate["y"],
          this.cellSize,
          this.cellSize
        );
        ctx.strokeRect(
          pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate["x"],
          pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate["y"],
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
      let rotateDirection = "cw"; // cw stands for "clock wise"
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
      let rotateDirection = "ccw"; // ccw stands for "counter clock wise"
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
});
</script>

<style>
.selected-piece-focus {
  box-shadow: inset 0 0 6px 2px;
}
</style>
