import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/mood/WelcomeView.vue'),
    },
    {
      path: '/mood',
      name: 'mood-select',
      component: () => import('@/views/mood/MoodSelectView.vue'),
    },
    {
      path: '/quote/:mood',
      name: 'quote',
      component: () => import('@/views/quote/QuoteView.vue'),
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('@/views/habits/HabitView.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/stats/StatsView.vue'),
    },
  ],
});

export default router;
