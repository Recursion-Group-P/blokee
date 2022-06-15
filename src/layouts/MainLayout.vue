<template>
    <q-layout style="background-color: #f2f4f7" view="hHh lpR fFf">
        <q-header
            :class="[$q.screen.xs ? '' : 'header']"
            style="background-color: #f2f4f7; color: black"
        >
            <q-toolbar>
                <q-btn-dropdown flat dense round dropdown-icon="menu" no-icon-animation>
                    <q-list class="q-py-md" style="width: 250px">
                        <q-item
                            v-for="(nav, index) in navs"
                            :key="index"
                            :to="nav.to"
                            exact
                            clickable
                        >
                            <q-item-section avatar>
                                <q-icon :name="nav.icon" />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>{{ nav.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item
                            v-if="$q.platform.is.electron"
                            @click="quitApp"
                            class="absolute-bottom"
                            clickable
                        >
                            <q-item-section avatar>
                                <q-icon name="power_settings_new" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>Quit</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>

                <q-toolbar-title> Blockee </q-toolbar-title>

                <!-- <q-item class="row items-center" v-if="auth.loggedIn">
          <div class="text-weight-bold q-mr-sm dont-show-mobile">{{ auth.user.displayName }}</div>
          <q-avatar class="q-mr-sm" size="30px">
            <img :src="auth.user.photoURL" />
          </q-avatar>
          <q-btn outlined dense flat icon="fa-solid fa-arrow-right-from-bracket" @click="logout" />
        </q-item> -->
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
// import { mapState, mapActions } from 'vuex';

export default {
    name: 'MainLayout',
    data() {
        return {
            leftDrawerOpen: false,
            navs: [
                {
                    label: 'Home',
                    icon: 'public',
                    to: '/',
                },
                {
                    label: 'Settings',
                    icon: 'settings',
                    to: '/settings',
                },
                {
                    label: 'FAQ',
                    icon: 'question_answer',
                    to: '/faq',
                },
            ],
        };
    },

    // computed: {
    //     ...mapState(['auth']),
    //     // ログイン状態によって nav を表示・非表示する
    //     filteredNavs() {
    //         return this.navs.filter((nav) => {
    //             if (this.auth.loggedIn) {
    //                 return nav;
    //             } else {
    //                 if (!nav.requiresAuth) return nav;
    //             }
    //         });
    //     },
    // },

    methods: {
        // ...mapActions('auth', ['logout']),

        quitApp() {
            this.$q
                .dialog({
                    title: 'Confirm',
                    message: 'Would you like to quit Blockee?',
                    cancel: true,
                    persistent: true,
                })
                .onOk(() => {
                    if (this.$q.platform.is.electron) {
                        require('electron').ipcRenderer.send('quit-app');
                    }
                });
        },
    },
};
</script>

<style lang="scss">
.header {
    padding: 0 3%;
}

@media screen and (max-width: 768px) {
    .dont-show-mobile {
        display: none;
    }
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
body {
    font-family: 'Poppins', sans-serif;
}
</style>
