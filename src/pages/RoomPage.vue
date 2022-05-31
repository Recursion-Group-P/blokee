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
import { mapGetters } from 'vuex';

export default {
  components: {
    'player-area': PlayerArea,
  },
  computed: {
    ...mapGetters('game', [
      'timeForEachPlayer',
      'numberOfPlayers',
      'boardSettings',
      'currentPlayerIndex',
      'players',
    ]),
  },
  mounted() {
    const context = this.$refs.canvasRef.getContext('2d');
    if (context !== null) {
      this.draw(context);
    }
  },
  data() {
    return {
      numOfPlayers: 4,
      currentPlayer: null,
      pieceColors: ['#448DD7', '#F48989', '#9FD782', '#FFDF54'],
    };
  },
  methods: {
    draw(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.beginPath();

      for (let x = 0; x <= ctx.canvas.width; x += this.boardSettings.cellWidth) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, ctx.canvas.width);
      }

      for (let x = 0; x <= ctx.canvas.width; x += this.boardSettings.cellWidth) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(ctx.canvas.width, 0.5 + x);
      }

      ctx.fillStyle = '#CDD5DF';
      ctx.fillRect(0, 0, this.boardSettings.width, this.boardSettings.height);
      ctx.strokeStyle = 'white';
      ctx.stroke();

      for (const [row, col] of this.boardSettings.startingPositions) {
        ctx.beginPath();
        const [x, y] = this.getStartingPoint(row + 0.5, col + 0.5);
        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        ctx.arc(x, y, 30 * 0.15, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
    },
    getStartingPoint(row, col) {
      return [0.5 + col * 30, 0.5 + row * 30];
    },
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
