<template>
  <q-page padding>
    <h2 class="text-center">Game Settings</h2>
    <div class="row justify-center">
      <div class="col-3 text-center">
        <q-select v-model="numberOfPlayers" :options="numberOfPlayersOptions" label="Number of players" />
        <q-select v-model="timeForEachPlayer" :options="timeForEachPlayerOptions" label="Time for each player" />
        <q-select v-model="startPosition" :options="startPositionOptions" label="Start position" />
        <q-btn class="q-mt-lg" @click="gameStart" to="/room" unelevated rounded color="primary" label="Game Start" />
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
        timeForEachPlayer: Config.timeForEachPlayer,
        timeForEachPlayerOptions: Config.timeForEachPlayerOptions,
        startPosition: Config.startPosition,
        startPositionOptions: Config.startPositionOptions,
      };
    },
    methods: {
      gameStart() {
        console.log(this.numberOfPlayers);
        console.log(this.timeForEachPlayer);
        console.log(this.startPosition);
      },
    },
  };
</script>

<style></style>
