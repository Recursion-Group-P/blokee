<template>
  <div class="bg-grey-2 rounded-borders q-pa-sm">
    <canvas
      v-for="(piece, idx) in players[playerId].remainingPieces"
      :key="idx"
      :ref="'canvas' + '-' + playerId + '-' + idx"
      class="cursor-pointer"
      style="width: 20%"
      height="250"
      :data-selected-piece-id="idx"
      @click="selectPiece"
    ></canvas>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  props: ["playerId"],
  computed: {
    ...mapGetters("game", ["players"]),
  },
  data() {
    return {
      cellSize: 50,
      startDrawCoordinate: { x: 100, y: 100 },
    };
  },
  methods: {
    ...mapActions([
      "setPlayers", //also supports payload `this.nameOfAction(amount)`
    ]),
    // for pieces
    drawPiece(canvasId, pieceCoordinate) {
      let canvas = this.$refs[canvasId][0];
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = this.players[this.playerId].color;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;

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
    selectPiece(e) {
      this.$emit("select-piece", e.currentTarget.getAttribute("data-selected-piece-id"));
    },
  },
  mounted() {
    const pieceCoordinates = this.players[this.playerId].remainingPieces;
    for (let idx = 0; idx < pieceCoordinates.length; idx++) {
      this.drawPiece("canvas" + "-" + this.playerId + "-" + idx, pieceCoordinates[idx]);
    }
  },
};
</script>

<style>
canvas {
  image-rendering: optimizeSpeed;
  image-rendering: pixelated;
}
</style>
