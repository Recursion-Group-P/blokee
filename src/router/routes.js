const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', component: () => import('pages/HomePage.vue') 
      },
      { 
        path: '/settings', component: () => import('pages/SettingsPage.vue') 
      },
      { 
        path: '/room', component: () => import('pages/RoomPage.vue') 
      },
      { 
        path: '/faq', component: () => import('pages/FaqPage.vue') 
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes