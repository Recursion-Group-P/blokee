<template>
    <q-page padding>
        <h2 class="text-center">Game Settings</h2>
        <div class="text-h6 text-center">プレイ人数・持ち時間・開始位置を選んでください。</div>
        <div class="row justify-center q-mt-lg">
            <div class="col-10 col-md-3 text-center">
                <q-card class="my-card">
                    <q-card-section>
                        <q-select
                            v-model="numberOfPlayers"
                            :options="numberOfPlayersOptions"
                            label="Number of players"
                        />
                        <q-select
                            v-model="timeForEachPlayer"
                            :options="timeForEachPlayerOptions"
                            label="Time for each player"
                        />
                        <q-select
                            v-model="startPosition"
                            :options="startPositionOptions"
                            label="Start position"
                        />
                        <q-btn
                            class="q-mt-lg"
                            @click="gameStart"
                            to="/room"
                            unelevated
                            rounded
                            color="primary"
                            label="Game Start"
                        />
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script>
import { Config } from '../config/index';
import { mapActions } from 'vuex';
import Vue from 'vue';

export default Vue.extend({
    name: 'SettingsPage',
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
        ...mapActions('game', ['setGameSettings']),
        gameStart() {
            this.setGameSettings({
                numberOfPlayers: this.numberOfPlayers,
                timeForEachPlayer: this.timeForEachPlayer['value'],
                startPosition: this.startPosition,
            });
        },
    },
});
</script>

<style></style>
