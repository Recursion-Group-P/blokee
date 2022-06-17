<template>
  <q-card style="width: 700px; max-width: 100vw" class="q-pa-sm">
    <q-card-section class="q-pa-sm">
      <div class="text-center bg-grey-2 rounded-borders q-pa-md">
        <div class="row">
          <div class="col-1"></div>
          <div class="col-7 col-5-md"></div>
          <div class="col-1 col-3-md">Score</div>
          <div class="col-3 col-3-md">Time</div>
        </div>
        <div
          v-for="(result, index) in finalResults"
          :key="index"
          class="row text-h6 q-mb-sm"
          style="line-height: 45px"
        >
          <div class="col-1">
            <div
              class="rank-badge text-white shadow-1"
              :style="`background-color: ${playerColor[result.playerId]};`"
            >
              <p class="rank-badge-text">
                {{ index + 1 }}
              </p>
            </div>
          </div>
          <div class="col-7 col-5-md">{{ result.playerName }}</div>
          <div class="col-1 col-3-md">{{ result.score }}</div>
          <div class="col-3 col-3-md">{{ formatTime(result.remainingTime) }}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <div class="full-width text-center q-mb-md">
        <q-btn rounded color="dark" class="q-px-md" to="/replay">Review the game</q-btn>
      </div>
      <div class="full-width text-center q-mb-sm">
        <div>New game?</div>
      </div>
      <!-- <div class="full-width text-center q-mb-sm">
        <q-btn
          rounded
          color="blue-grey"
          class="q-px-md"
          to="/room"
          @click="newGameWithSameSettings"
          >With same settings</q-btn
        >
      </div> -->
      <div class="full-width text-center q-mb-sm">
        <q-btn rounded color="dark" class="q-px-md" to="/settings">Go to settings page</q-btn>
      </div>
      <div class="full-width text-center">
        <q-btn flat round color="dark" icon="home" to="/"></q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { PLAYER_COLORS } from 'src/constants';
import { Evaluation } from 'src/model/evaluation';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      playerColor: PLAYER_COLORS,
      gameOver: false,
    };
  },

  computed: {
    ...mapGetters('game', ['numberOfPlayers', 'timeForEachPlayer', 'startPosition', 'players']),

    finalResults() {
      return new Evaluation(this.players).getFinalResults();
    },
  },

  methods: {
    ...mapActions('game', ['formatState', 'setGameSettings']),
    // newGameWithSameSettings() {
    //   // 今のsettings情報を退避
    //   const currentSettings = {
    //     numberOfPlayers: this.numberOfPlayers,
    //     timeForEachPlayer: this.timeForEachPlayer,
    //     startPosition: this.startPosition,
    //   };
    //   // stateを初期化
    //   this.formatState();
    //   // 今のsettingsを引き継いで新しいgameの作成
    //   this.setGameSettings({
    //     numberOfPlayers: currentSettings.numberOfPlayers,
    //     timeForEachPlayer: currentSettings.timeForEachPlayer,
    //     startPosition: currentSettings.startPosition,
    //   });
    // },
    formatTime(remainingTime) {
      let min = Math.floor(remainingTime / 60);
      let sec = ('00' + (remainingTime % 60)).slice(-2);
      let formatTime = `${min}:${sec}`;
      return formatTime;
    },
  },
});
</script>

<style>
.rank-badge {
  margin-top: 5px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.rank-badge-text {
  position: relative;
  top: -20%;
  left: 1%;
}

@media screen and (min-width: 786px) {
  .rank-badge {
    position: relative;
    bottom: 5px;
    height: 45px;
    width: 45px;
  }

  .rank-badge-text {
    position: relative;
    top: 5%;
  }
}
</style>
