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
      <div class="bg-grey-2 rounded-borders q-pa-sm">
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["initialPieces", "selectedPieceId", "playerId", "pieceColors"],
  data() {
    return {
      cellSize: 30,
      startDrawCoordinate: { x: 135, y: 60 }, // 150-(30/2), 75-(30/2)
      pieceCoordinate: null,
      isFlipped: false,
    };
  },
  methods: {
    // Draw the selected piece
    drawPiece(pieceCoordinate, flip = false, rotateDirection = null) {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = this.pieceColors[this.playerId - 1];
      // Clear drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Flip
      if (flip === true) {
        ctx.translate(150, 75);
        ctx.scale(-1, 1);
        ctx.translate(-150, -75);
      }
      // Rotate
      if (rotateDirection !== null) {
        if (rotateDirection === "cw") {
          ctx.translate(150, 75);
          ctx.rotate((90 * Math.PI) / 180);
          ctx.translate(-150, -75);
        }
        if (rotateDirection === "ccw") {
          ctx.translate(150, 75);
          ctx.rotate((-90 * Math.PI) / 180);
          ctx.translate(-150, -75);
        }
      }
      // Draw center piece
      ctx.fillRect(
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
      }
    },
    getCoordinatesFromCenter(array) {
      let splitByBreakLine = array.split(/\n/);
      let centerCoordinate = null;
      const otherCoordinates = [];
      for (let i = 0; i < splitByBreakLine.length; i++) {
        for (let j = 0; j < splitByBreakLine[i].length; j++) {
          if (splitByBreakLine[i][j] == "C") {
            centerCoordinate = [i, j];
          } else if (splitByBreakLine[i][j] == "O") {
            otherCoordinates.push([i, j]);
          }
        }
      }

      let pieceCoodinate = otherCoordinates.map((coordPair) => [
        coordPair[0] - centerCoordinate[0],
        coordPair[1] - centerCoordinate[1],
      ]);

      return pieceCoodinate;
    },

    // Alter piece
    flipPiece() {
      let flip = true;
      this.drawPiece(this.pieceCoordinate, flip);
    },
    turnPiece90DegreeClockwise() {
      let rotateDirection = "cw"; // cw stands for "clock wise"
      this.drawPiece(this.pieceCoordinate, false, rotateDirection);
    },
    turnPiece90DegreeCounterClockwise() {
      let rotateDirection = "ccw"; // cw stands for "counter clock wise"
      this.drawPiece(this.pieceCoordinate, false, rotateDirection);
    },
    cancelPiece(e) {
      this.$emit("cancel-piece", e.currentTarget.getAttribute("data-selected-piece-id"));
    },
  },
  mounted() {
    let pieceCoordinate = this.getCoordinatesFromCenter(
      this.initialPieces[this.selectedPieceId]
    );
    // Store piece coordinate in data
    this.pieceCoordinate = pieceCoordinate;
    // Draw piece
    this.drawPiece(pieceCoordinate);
  },
};
</script>

<style lang=""></style>
