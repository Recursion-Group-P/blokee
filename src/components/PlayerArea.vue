<template>
  <div class="rounded-borders shadow-1 q-ma-md q-pa-md">
    <div class="row justify-between items-center">
      <h5 class="q-ma-sm">Player 1</h5>
      <div class="q-mb-md row">
        <q-icon name="timer"></q-icon>
        <p>{{ formatTime }}</p>
      </div>
    </div>
    <piece-selector
      @select-piece="selectPiece"
      v-if="selectedPieceId == -1"
      :initial-pieces="initialPieces"
    />
    <piece-alter
      @cancel-piece="selectPiece"
      v-else
      :initial-pieces="initialPieces"
      :selected-piece-id="selectedPieceId"
    />
  </div>
</template>

<script>
import PieceAlter from "./PieceAlter.vue";
import PieceSelector from "./PieceSelector.vue";
export default {
  components: {
    "piece-alter": PieceAlter,
    "piece-selector": PieceSelector,
  },
  data() {
    return {
      // For timer
      time: 600,
      timerObj: null,
      // For pieces
      initialPieces: {
        0: "C", //1
        1: "CO", //2
        2: "OCO", //3
        3: " O\nOC", //4
        4: "OCOO", //5
        5: "O\nOCO", // 6
        6: "CO\nOO", //7
        7: "CO\n OO", //8
        8: " O \nOCO", //9
        9: "O O\nOCO", //10
        10: "OO\nCO\nO", //11
        11: "OOCOO", //12
        12: "O\nOCOO", //13
        13: "  O  \n  O  \nOCO", //14
        14: "OOC\n  O\n  O", //15
        15: " O \nOCO\n O", //16
        16: " O\nOC\n OO", //17
        17: " OO\n C\nOO", //18
        18: "OOC\n  OO", //19
        19: "OO\nCO\nO", //20
        20: " O\nOCOO", //21
      },
      selectedPieceId: -1,
    };
  },
  computed: {
    formatTime() {
      let min = ("00" + Math.floor(this.time / 60)).slice(-2);
      let sec = ("00" + (this.time % 60)).slice(-2);
      let formatTime = `${min}:${sec}`;
      return formatTime;
    },
  },
  methods: {
    // for timer
    countDown() {
      this.time--;
    },
    startTimer() {
      let self = this;
      this.timerObj = setInterval(function () {
        self.countDown();
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerObj);
    },
    selectPiece(e) {
      this.selectedPieceId = e;
    },
    // cancelPiece(e) {
    //   this.selectedPieceId = e;
    // },
    // // for pieces
    // drawPiece(canvasId, pieceCoordinate) {
    //   let canvas = this.$refs[canvasId][0];
    //   let ctx = canvas.getContext("2d");
    //   // Draw center piece
    //   ctx.fillRect(
    //     this.startDrawCoordinate["x"],
    //     this.startDrawCoordinate["y"],
    //     this.cellSize,
    //     this.cellSize
    //   );
    //   // Draw other piece
    //   for (let i = 0; i < pieceCoordinate.length; i++) {
    //     ctx.fillRect(
    //       pieceCoordinate[i][0] * this.cellSize + this.startDrawCoordinate["x"],
    //       pieceCoordinate[i][1] * this.cellSize + this.startDrawCoordinate["y"],
    //       this.cellSize,
    //       this.cellSize
    //     );
    //   }
    // },
    // getCoordinatesFromCenter(array) {
    //   let centerCoordinate = null;
    //   const otherCoordinates = [];
    //   for (let i = 0; i < array.length; i++) {
    //     for (let j = 0; j < array[i].length; j++) {
    //       if (array[i][j] == "C") {
    //         centerCoordinate = [i, j];
    //       } else if (array[i][j] == "O") {
    //         otherCoordinates.push([i, j]);
    //       }
    //     }
    //   }

    //   return otherCoordinates.map((coordPair) => [
    //     coordPair[0] - centerCoordinate[0],
    //     coordPair[1] - centerCoordinate[1],
    //   ]);
    // },
    // getAllPieces(pieces) {
    //   const allPieceCoordinates = [];
    //   for (let key in pieces) {
    //     allPieceCoordinates.push(this.getCoordinatesFromCenter(pieces[key].split(/\n/)));
    //   }

    //   return allPieceCoordinates;
    // },
  },
  //   mounted() {
  //     let pieceCoordinate = this.getAllPieces(this.pieces);
  //     for (let key in pieceCoordinate) {
  //       this.drawPiece("canvas" + key, pieceCoordinate[key]);
  //     }
  // this.pieceRemaining.forEach((pieceId) => {
  //   this.drawPiece("canvas" + pieceId);
  // });
  //   },
  // mounted() {
  //   this.pieceRemaining.forEach({pieceId}) => {
  //       this.$refs[pieceId]
  //       this.drawPiece()
  // },
};
</script>

<style lang="sass" scoped></style>
