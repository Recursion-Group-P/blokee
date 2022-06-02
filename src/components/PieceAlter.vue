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
        <q-btn
          outline
          color="grey-7"
          round
          icon="close"
          :data-selected-piece-id="-1"
          @click="cancelPiece"
        />
      </div>
      <div class="bg-grey-2 rounded-borders q-pa-sm row justify-center">
        <canvas ref="canvas" width="250" height="250"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  props: ["selectedPieceId", "playerId"],
  computed: {
    ...mapGetters("game", ["players"]),
  },
  data() {
    return {
      cellSize: 30,
      startDrawCoordinate: { x: 110, y: 110 },
      pieceCoordinate: null,
      isFlipped: false,
      currentDegree: 0,
    };
  },
  methods: {
    ...mapActions("game", ["updatePieceCoordinate"]),
    // Draw the selected piece
    drawPiece(pieceCoordinate, flip = false, rotateDirection = null) {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = this.players[this.playerId].color;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2.5;

      // Clear drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Flip
      if (flip === true) {
        ctx.translate(125, 125);
        if (this.currentDegree === 0 || this.currentDegree === 180) ctx.scale(-1, 1);
        if (this.currentDegree === 90 || this.currentDegree === 270) ctx.scale(1, -1);
        ctx.translate(-125, -125);
      }

      // Rotate
      if (rotateDirection !== null) {
        if (rotateDirection === "cw") {
          ctx.translate(125, 125);
          ctx.rotate((90 * Math.PI) / 180);
          ctx.translate(-125, -125);
        }
        if (rotateDirection === "ccw") {
          ctx.translate(125, 125);
          ctx.rotate((-90 * Math.PI) / 180);
          ctx.translate(-125, -125);
        }
      }

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
      let flip = true;
      this.drawPiece(this.pieceCoordinate, flip);
      // Update isFlipped
      this.isFlipped = !this.isFlipped;
    },
    turnPiece90DegreeClockwise() {
      let rotateDirection = "cw"; // cw stands for "clock wise"
      this.drawPiece(this.pieceCoordinate, false, rotateDirection);
      // Update currentDegree
      this.currentDegree += 90;
      if (this.currentDegree == 360) this.currentDegree = 0;
    },
    turnPiece90DegreeCounterClockwise() {
      let rotateDirection = "ccw"; // cw stands for "counter clock wise"
      this.drawPiece(this.pieceCoordinate, false, rotateDirection);
      // Update currentDegree
      this.currentDegree -= 90;
      if (this.currentDegree < 0) this.currentDegree = 360 + this.currentDegree;
    },

    // Cancel piece
    cancelPiece(e) {
      this.updatePieceCoordinate({
        playerId: this.playerId,
        selectedPieceId: this.selectedPieceId,
        isFlipped: this.isFlipped,
        currentDegree: this.currentDegree,
      });
      this.$emit("cancel-piece", e.currentTarget.getAttribute("data-selected-piece-id"));
    },
  },
  mounted() {
    this.pieceCoordinate = this.players[this.playerId].remainingPieces[
      this.selectedPieceId
    ];
    this.drawPiece(this.pieceCoordinate);
  },
};
</script>

<style lang=""></style>
