<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Blokee
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-tabs>
        <q-route-tab
          v-for="(nav,index) in navs"
          :key="index"
          :to="nav.to"
          :icon="nav.icon"
          :label="nav.label" 
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      show-if-above
      bordered
      content-class="bg-blue-2"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation
        </q-item-label>
        <q-item
          v-for="(nav,index) in navs"
          :key="index"
          :to="nav.to"
          exact
          clickable
        >
        <q-item-section
          avatar
        >
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
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      navs: [
        {
          label: 'Home',
          icon: 'public',
          description: 'Login & Register',
          to: '/'
        },
        {
          label: 'Settings',
          icon: 'settings',
          description: 'description2',
          to: '/settings'
        },
        {
          label: 'Room',
          icon: 'extension',
          description: 'description3',
          to: '/room'
        },
        {
          label: 'FAQ',
          icon: 'question_answer',
          description: 'description4',
          to: '/faq'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  @media screen and (min-width: 768px){
    .q-footer {
      display: none;
    }
  }
</style>