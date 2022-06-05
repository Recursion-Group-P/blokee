<template>
  <div id="q-app">
    <!-- ユーザーのログイン状態が確認出来るまで render を行わない -->
    <router-view v-if="auth.authIsReady" />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["auth"]),
  },
};
</script>
