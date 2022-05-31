<template>
  <div class="row wrap room">
    <!-- timer -->
    <!-- <div class="row" style="height: 100px">
      <q-card class="full-width bg-grey-3">
        <q-card-section>
          <p>Timer</p>
        </q-card-section>
      </q-card>
    </div> -->

    <!-- board -->
    <div class="board">
      <canvas ref="canvasRef" width="421" height="421" />
    </div>

    <div class="col-6" v-for="playerId of this.numOfPlayers" :key="playerId">
      <player-area :player-id="playerId" :piece-colors="pieceColors" />
    </div>
  </div>
</template>

<script>
import PlayerArea from "src/components/PlayerArea.vue";
export default {
  components: {
    "player-area": PlayerArea,
  },
  data() {
    return {
      numOfPlayers: 4,
      currentPlayer: null,
      pieceColors: ["#448DD7", "#F48989", "#9FD782", "#FFDF54"],
    };
  },

  mounted() {
    const context = this.$refs.canvasRef.getContext("2d");
    if (context !== null) {
      this.draw(context);
    }
  },
  methods: {
    draw(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.beginPath();
      for (let x = 0; x <= 14 * 30; x += 30) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, 14 * 30);
      }

      for (let x = 0; x <= 14 * 30; x += 30) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(14 * 30, 0.5 + x);
      }

      ctx.strokeStyle = "black";
      ctx.stroke();
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
