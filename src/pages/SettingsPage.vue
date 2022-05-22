<template>
  <q-page padding>
    <h2 class="text-center">Game Settings</h2>
    <div class="row justify-center">
      <div class="col-3 text-center">
        <q-select
          v-model="numberOfPlayers"
          :options="numberOfPlayersOptions"
          label="Number of players"
        />
        <q-select
          v-model="time.initial"
          :options="time.options"
          label="Time for each player"
        />
        <q-select
          v-model="position.initial"
          :options="position.options"
          label="Start position"
        />
        <q-btn
          class="q-mt-lg"
          @click="gameStart"
          unelevated
          rounded
          color="primary"
          label="Game Start"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Config } from "../config/index";
export default {
  name: "SettingsPage",
  data() {
    return {
      numberOfPlayers: Config.numberOfPlayers,
      numberOfPlayersOptions: Config.numberOfPlayersOptions,
      num: {
        initial: "4 player",
        options: ["2 player", "4 player"],
      },
      time: {
        initial: "10 min",
        options: ["5 min", "10 min", "20 min"],
      },
      position: {
        initial: "Corner",
        options: ["Center", "Corner", "Anywhere"],
      },
    };
  },
  methods: {
    gameStart() {
      console.log(this.numberOfPlayers);
    },
  },
};
</script>

<style></style>