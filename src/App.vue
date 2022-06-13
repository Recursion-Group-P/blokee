<template>
    <div id="q-app">
        <!-- ユーザーのログイン状態が確認出来るまで render を行わない -->
        <router-view />
    </div>
</template>

<script>
// import { mapState } from 'vuex';

export default {
    computed: {
        // ...mapState(['auth']),
    },
    mounted() {
        if (this.$q.platform.is.electron) {
            window.ipcRenderer.on('show-settings', () => {
                this.$router.push('/settings');
            });
        }
    },
};
</script>
