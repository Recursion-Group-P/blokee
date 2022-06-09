<template>
  <q-layout style="background-color: #f2f4f7" view="hHh lpR fFf">
    <q-header :class="[$q.screen.xs ? '' : 'header']" style="background-color: #f2f4f7; color: black">
      <q-toolbar>
        <q-btn-dropdown flat dense round dropdown-icon="menu" no-icon-animation>
          <q-list class="q-py-md" style="width: 250px">
            <q-item v-for="(nav, index) in filteredNavs" :key="index" :to="nav.to" exact clickable>
              <q-item-section avatar>
                <q-icon :name="nav.icon" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ nav.label }}</q-item-label>
                <q-item-label caption>
                  {{ nav.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->

        <q-toolbar-title> Blockee </q-toolbar-title>

        <q-item class="row items-center" v-if="auth.loggedIn">
          <div class="text-weight-bold q-mr-sm dont-show-mobile">{{ auth.user.displayName }}</div>
          <q-avatar class="q-mr-sm" size="30px">
            <img :src="auth.user.photoURL" />
          </q-avatar>
          <q-btn outlined dense flat icon="fa-solid fa-arrow-right-from-bracket" @click="logout" />
        </q-item>
      </q-toolbar>
    </q-header>

    <!-- <q-footer>
      <q-tabs>
        <q-route-tab
          v-for="(nav, index) in filteredNavs"
          :key="index"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label"
        />
      </q-tabs>
    </q-footer> -->

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      :breakpoint="767"
      :width="250"
      bordered
      content-class="bg-blue-2"
    >
      <q-list>
        <q-item-label header class="text-grey-8"> Navigation </q-item-label>
        <q-item v-for="(nav, index) in filteredNavs" :key="index" :to="nav.to" exact clickable>
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
            <q-item-label caption>
              {{ nav.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: false,
      navs: [
        {
          label: 'Home',
          icon: 'public',
          description: 'Login & Register',
          to: '/',
          requiresAuth: false,
        },
        {
          label: 'Settings',
          icon: 'settings',
          description: 'description2',
          to: '/settings',
          requiresAuth: true,
        },
        {
          label: 'FAQ',
          icon: 'question_answer',
          description: 'description4',
          to: '/faq',
          requiresAuth: false,
        },
      ],
    };
  },

  computed: {
    ...mapState(['auth']),
    // ログイン状態によって nav を表示・非表示する
    filteredNavs() {
      return this.navs.filter((nav) => {
        if (this.auth.loggedIn) {
          return nav;
        } else {
          if (!nav.requiresAuth) return nav;
        }
      });
    },
  },

  methods: {
    ...mapActions('auth', ['logout']),
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
</style>
