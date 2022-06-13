<template>
  <q-card class="q-pa-md" style="width: 60vw">
    <q-card-section class="text-center q-pb-none">
      <div class="text-h3 text-center">Game Over</div>
    </q-card-section>
    <q-card-section>
      <div class="text-center bg-grey-2 rounded-borders q-pa-lg">
        <div class="row">
          <div class="col-1"></div>
          <div class="col"></div>
          <div class="col">Total Score</div>
          <div class="col">Time Left</div>
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
              {{ index + 1 }}
            </div>
          </div>
          <div class="col">Player {{ result.playerId + 1 }}</div>
          <div class="col">{{ result.score }}</div>
          <div class="col">{{ formatTime(result.remainingTime) }}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <div class="full-width text-center q-mb-md">
        <q-btn rounded color="blue-grey" class="q-px-md" to="/replay"
          >Review the game</q-btn
        >
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
        <q-btn
          rounded
          color="blue-grey"
          class="q-px-md"
          to="/settings"
          @click="newGameWithNewSettings"
          >Go to settings page</q-btn
        >
      </div>
      <div class="full-width text-center">
        <q-btn flat round color="grey-9" icon="home" to="/"></q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { PLAYER_COLORS } from "src/constants";
import { Evaluation } from "src/model/evaluation";
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      playerColor: PLAYER_COLORS,
      gameOver: false,
    };
  },

  computed: {
    ...mapGetters("game", [
      "numberOfPlayers",
      "timeForEachPlayer",
      "startPosition",
      "players",
    ]),

    finalResults() {
      let evaluation = new Evaluation(this.players);
      let finalResults = evaluation.getFinalResults();
      return finalResults;
    },
  },

  methods: {
    ...mapActions("game", ["formatState", "setGameSettings"]),
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
    newGameWithNewSettings() {
      this.formatState();
    },
    formatTime(remainingTime) {
      let min = Math.floor(remainingTime / 60);
      let sec = ("00" + (remainingTime % 60)).slice(-2);
      let formatTime = `${min}:${sec}`;
      return formatTime;
    },
  },
});
</script>

<style>
.rank-badge {
  height: 45px;
  width: 45px;
  border-radius: 50%;
}
</style>
