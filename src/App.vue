<template>
  <div id="q-app">
    <!-- ユーザーのログイン状態が確認出来るまで render を行わない -->
    <router-view v-if="auth.authIsReady" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(['auth'])
  },

  methods: {
    ...mapActions("auth", ["onAuth"]),
  },

  created() {
    this.onAuth();
  },
};
</script>
