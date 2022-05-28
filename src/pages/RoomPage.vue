<template>
  <div>
    <!-- timer -->
    <div class="row" style="height: 100px">
      <q-card class="full-width bg-grey-3">
        <q-card-section>
          <p>Timer</p>
        </q-card-section>
      </q-card>
    </div>

    <!-- user piece card 1 -->
    <!-- <div class="col">// <piece-selector :userColor="red" /></div> -->

    <!-- board -->
    <div class="col">
      <canvas ref="canvasRef" width="421" height="421" />
    </div>

    <!-- user piece card 2 -->
    <!-- <div class="col">// <piece-selector :userColor="blue" /></div> -->
  </div>
</template>

<script>
export default {
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

<style></style>
