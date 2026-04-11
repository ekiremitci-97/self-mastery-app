import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/mood/WelcomeView.vue'),
      meta: { showTabBar: false },
    },
    {
      path: '/garden',
      name: 'garden',
      component: () => import('@/views/mood/MoodSelectView.vue'),
      meta: { showTabBar: true },
    },
    {
      path: '/garden/quote/:mood',
      name: 'quote',
      component: () => import('@/views/quote/QuoteView.vue'),
      meta: { showTabBar: false },
    },
    {
      path: '/routine',
      name: 'routine',
      component: () => import('@/views/habits/HabitView.vue'),
      meta: { showTabBar: true },
    },
    {
      path: '/routine/stats',
      name: 'stats',
      component: () => import('@/views/stats/StatsView.vue'),
      meta: { showTabBar: false },
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/guru/GuruView.vue'),
      meta: { showTabBar: true },
    },
    {
      path: '/reflect',
      name: 'reflect',
      component: () => import('@/views/journey/JourneyView.vue'),
      meta: { showTabBar: true },
    },
  ],
});

export default router;
