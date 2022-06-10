<template>
  <q-card>
    <q-card-section class="text-right no-padding no-margin">
      <q-btn flat icon="close" v-close-popup />
    </q-card-section>
    <q-card-section class="text-center q-pt-none">
      <div class="text-h2 text-center">GameOver</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="flex">
        <div class="rounded-borders shadow-1 q-my-sm q-mr-sm q-pa-md" :style="`background-color:${playerColor[0] + '66'};`">
          <div class="text-h4 q-pr-md">1st : Player 1</div>
          <div class="">
            Score …… 45<br>
            remainingTime …… 5:23
          </div>
        </div>
        <div class="rounded-borders shadow-1 q-my-sm q-pa-md" :style="`background-color:${playerColor[1] + '66'};`">
          <div class="text-h4 q-pr-md">2nd : Player 2</div>
          <div class="">
            Score …… 40<br>
            remainingTime …… 4:23
          </div>
        </div>
      </div>
      <div class="flex" v-if="numberOfPlayers > 2">
        <div class="rounded-borders shadow-1 q-my-sm q-mr-sm q-pa-md" :style="`background-color:${playerColor[2] + '66'};`" v-if="numberOfPlayers > 2">
          <div class="text-h4 q-pr-md">3rd : Player 3</div>
          <div class="">
            Score …… 30<br>
            remainingTime …… 8:23
          </div>
        </div>
        <div class="rounded-borders shadow-1 q-my-sm q-pa-md" :style="`background-color: ${playerColor[3] + '66'};`" v-if="numberOfPlayers > 2">
          <div class="text-h4 q-pr-md">4th : Player 4</div>
          <div class="">
            Score …… 10<br>
            remainingTime …… 2:23
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn color="primary" class="q-mb-md" to="/replay">play again</q-btn>
      <q-btn color="primary" class="q-mb-md" to="/settings">back to settings</q-btn>
      <q-btn color="primary" class="q-mb-md" to="/replay">goto replay</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { PLAYER_COLORS } from 'src/constants';

export default {
  data() {
    return {
      playerColor: PLAYER_COLORS
    };
  },

  computed: {
    ...mapGetters('game', ['numberOfPlayers']),
  }
}
</script>
