<template>

  <div>
    <!-- timer -->
    <!-- <div class="row" style="height: 100px">
      <q-card class="full-width bg-grey-3">
        <q-card-section>
          <p>Timer</p>
        </q-card-section>
      </q-card>
    </div> -->

    <div class="row items-center" style="height: calc(100vh - 50px)">

      <!-- user piece card 1 -->
      <div class="col-12 col-sm-3">
        <q-card flat bordered class="my-card bg-red-1" style="height: 50vh;">
          <q-card-section class="bg-red-11">
            <div class="text-h6">Player 1</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>piece area</q-card-section>
        </q-card>

        <q-card flat bordered v-if="numberOfPlayers === 4" class="my-card bg-yellow-1" style="height: 50vh;">
          <q-card-section class="bg-yellow-11">
            <div class="text-h6">Player 3</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>piece area</q-card-section>
        </q-card>
      </div>
      <!-- board -->
      <div class="col-12 col-sm-6 text-center">
        <div class="full-width row justify-center items-center">
          <canvas ref="canvasRef" :width="boardSettings.width" :height="boardSettings.height" />
        </div>
      </div>

      <!-- user piece card 2 -->
      <div class="col-12 col-sm-3">
        <q-card flat bordered class="my-card bg-light-green-1" style="height: 50vh;">
          <q-card-section class="bg-light-green-11">
            <div class="text-h6">Player 2</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>piece area</q-card-section>
        </q-card>
        <q-card flat bordered v-if="numberOfPlayers === 4" class="my-card bg-blue-1" style="height: 50vh;">
          <q-card-section class="bg-blue-11">
            <div class="text-h6">Player 4</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>piece area</q-card-section>
        </q-card>
      </div>
      <!-- <div class="col">++ <piece-selector :userColor="blue" /></div> -->
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed:{
      ...mapGetters('game', ['timeForEachPlayer', 'numberOfPlayers', 'boardSettings', 'currentPlayerIndex']),
    },
    mounted() {
      const context = this.$refs.canvasRef.getContext("2d");
      if (context !== null) {
        this.draw(context);
      }
    },
    data() {
      return {
      }
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

        ctx.fillStyle = "#CDD5DF"
        ctx.fillRect(0, 0, this.boardSettings.width, this.boardSettings.height);
        ctx.strokeStyle = "white";
        ctx.stroke();
      },
    },
  };
</script>

<style>
  /* #boardArea {
    height: calc(100vh - 75px);
  } */
</style>
