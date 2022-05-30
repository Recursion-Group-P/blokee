<template>
  <div class="bg-grey-2 rounded-borders q-pa-sm">
    <canvas
      v-for="(value, key) in pieces"
      :key="key"
      :ref="'canvas' + key"
      class="cursor-pointer"
      style="width: 25%"
      :data-selected-piece-id="key"
      @click="selectPiece"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: ["initialPieces"],
  data() {
    return {
      pieces: this.initialPieces,
      cellSize: 50,
      startDrawCoordinate: { x: 100, y: 50 },
    };
  },
  methods: {
    // for pieces
    drawPiece(canvasId, pieceCoordinate) {
      let canvas = this.$refs[canvasId][0];
      let ctx = canvas.getContext("2d");
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
      let centerCoordinate = null;
      const otherCoordinates = [];
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
          if (array[i][j] == "C") {
            centerCoordinate = [i, j];
          } else if (array[i][j] == "O") {
            otherCoordinates.push([i, j]);
          }
        }
      }

      return otherCoordinates.map((coordPair) => [
        coordPair[0] - centerCoordinate[0],
        coordPair[1] - centerCoordinate[1],
      ]);
    },
    getAllPieceCoordinate(pieces) {
      const allPieceCoordinates = [];
      for (let key in pieces) {
        allPieceCoordinates.push(this.getCoordinatesFromCenter(pieces[key].split(/\n/)));
      }

      return allPieceCoordinates;
    },
    selectPiece(e) {
      this.$emit("select-piece", e.currentTarget.getAttribute("data-selected-piece-id"));
    },
  },
  mounted() {
    let pieceCoordinate = this.getAllPieceCoordinate(this.pieces);
    for (let key in pieceCoordinate) {
      this.drawPiece("canvas" + key, pieceCoordinate[key]);
    }
  },
};
</script>

<style lang=""></style>
