const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: 'home',
        component: () => import("pages/HomePage.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/settings",
        name: 'settings',
        component: () => import("pages/SettingsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/room",
        name: 'room',
        component: () => import("pages/RoomPage.vue"),
        meta: { requiresAuth: true },
        props:true,
      },
      {
        path: "/faq",
        name: 'faq',
        component: () => import("pages/FaqPage.vue"),
        meta: { requiresAuth: false },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
