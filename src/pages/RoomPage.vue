<template>
  <div class="row wrap room justify-center">
    <section class="tab">
      <ul class="tab__label">
        <li v-for="item in items" :key="item.id">
          <a href="#" @click.prevent="activate(item.id)" :class="{active: active === item.id}">
            {{item.playerName}}
          </a>
        </li>
      </ul>

      <div class="tab__content" v-show="active === 1">
        <player-area :playerId="0" />
      </div>
      <div class="tab__content" v-show="active === 2">
        <player-area :playerId="1" />
      </div>
      <div class="tab__content" v-if="players.length > 2" v-show="active === 3">
        <player-area :playerId="2" />
      </div>
      <div class="tab__content" v-if="players.length > 2" v-show="active === 4">
        <player-area :playerId="3" />
      </div>
    </section>

    <div class="row justify-center items-center" >
      <div class="col-12 col-sm-6 col-md-3 flex hidden">
        <player-area :playerId="0" />
        <player-area v-if="players.length > 2" :playerId="2" />
      </div>

      <!-- board -->
      <div class="col-12 col-md-6 text-center">
        <div class="full-width row justify-center items-center">
          <canvas ref="canvasRef" :width="boardSettings.width" :height="boardSettings.height" />
        </div>
      </div>

      <div class="col-12 col-sm-6 col-md-3 flex justify-end hidden">
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
        active: 1,
        items: [
          { id: 1, playerName: "Player 1" },
          { id: 2, playerName: "Player 2" },
          { id: 3, playerName: "Player 3" },
          { id: 4, playerName: "Player 4" },
        ]
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
      activate(id) {
        this.active = id;
      }
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
  .tab{font-size:14px;margin:20px auto;width:600px}.tab__label{list-style:none;padding:0;margin:0;display:-webkit-box;display:-ms-flexbox;display:flex}.tab__label li a{display:inline-block;width:130px;text-align:center;padding:8px 0;color:#333;text-decoration:none;border-radius:10px 10px 0 0}.tab__label li a.active{background:#E6F0FF}.tab__label li a:not(.active):hover{opacity:0.5;-webkit-transition:0.4s;transition:0.4s}.tab__content{background:#E6F0FF;font-size:16px;min-height:150px;padding:15px;display:block}
</style>
