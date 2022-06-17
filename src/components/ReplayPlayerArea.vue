<template>
  <div
    class="rounded-borders shadow-1 q-my-sm q-mx-auto q-pa-md player-area relative-position"
    :style="`background-color: ${playerColor}; width: ${numberOfPlayers === 2 ? '100%' : '80%'}`"
  >
    <div class="row justify-between" style="height: 50%">
      <h5 class="q-ma-sm">
        <strong>{{ replay.players[playerId].name }}</strong>
      </h5>
    </div>
    <div class="rounded-borders q-pa-sm" style="background-color: #f2f4f7">
      <canvas
        v-for="pieceId in currPlayerRemainingPieces"
        :key="pieceId"
        :ref="'canvas' + pieceId"
        style="width: 20%"
        height="250px"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { PLAYER_COLORS } from 'src/constants';

export default {
  props: ['playerId'],

  mounted() {
    this.drawPieces();

    // mounted されてから実行
    this.$watch(
      'currPlayerRemainingPieces',
      function () {
        this.drawPieces();
      },
      {
        immediate: true,
      }
    );
  },

  data() {
    return {
      playerColor: PLAYER_COLORS[this.playerId] + '66',
      cellSize: 50,
      startDrawCoordinate: { x: 100, y: 100 },
    };
  },

  computed: {
    ...mapGetters('game', ['numberOfPlayers', 'replay']),

    currPlayerRemainingPieces() {
      const remainingPieces = this.replay.players[this.playerId].remainingPieces;
      return Object.keys(remainingPieces).reduce((filtered, pieceId) => {
        if (!remainingPieces[pieceId].isUsed) {
          filtered.push(parseInt(pieceId));
        }
        return filtered;
      }, []);
    },
  },

  methods: {
    // for pieces
    drawPiece(canvasId, pieceCoordinate) {
      let canvas = this.$refs[canvasId][0];
      let ctx = canvas.getContext('2d');
      ctx.fillStyle = this.replay.players[this.playerId].color;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;

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

    drawPieces() {
      const pieceCoordinates = this.replay.players[this.playerId].remainingPieces;
      for (const pieceId of this.currPlayerRemainingPieces) {
        this.drawPiece('canvas' + pieceId, pieceCoordinates[pieceId].pieceCoords);
      }
    },
  },
};
</script>
