import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import type { TimeOfDay } from '@/composables/useHabits';

export interface DefaultHabit {
  name: string;
  description: string;
  icon: MoodIconType;
  timeOfDay: TimeOfDay;
}

export const DEFAULT_HABITS: DefaultHabit[] = [
  // ── Morning ──────────────────────────────────────────────
  {
    name: '5 AM Club',
    description: 'Rise with intention, own the first hour',
    icon: 'sun',
    timeOfDay: 'morning',
  },
  {
    name: 'Drink Water',
    description: 'Hydrate your body first thing',
    icon: 'droplet',
    timeOfDay: 'morning',
  },
  {
    name: 'Body Ritual & Stretch',
    description: 'Wake up your body with movement',
    icon: 'dumbbell',
    timeOfDay: 'morning',
  },
  {
    name: 'Morning Journaling',
    description: 'Capture your thoughts and set intentions',
    icon: 'pen',
    timeOfDay: 'morning',
  },
  {
    name: 'Morning Meditation',
    description: 'Find stillness before the day begins',
    icon: 'leaf',
    timeOfDay: 'morning',
  },
  {
    name: 'Morning Brain Training',
    description: 'Sharpen your mind early',
    icon: 'laptop',
    timeOfDay: 'morning',
  },
  {
    name: 'Workout',
    description: 'Move your body, build your strength',
    icon: 'running',
    timeOfDay: 'morning',
  },

  // ── Afternoon ────────────────────────────────────────────
  {
    name: 'Daily Brain Training',
    description: 'Keep your mind sharp and active',
    icon: 'laptop',
    timeOfDay: 'afternoon',
  },
  {
    name: 'Daily Language',
    description: 'Practice and grow your language skills',
    icon: 'book',
    timeOfDay: 'afternoon',
  },

  // ── Evening ──────────────────────────────────────────────
  {
    name: 'Evening Brain Training',
    description: 'Wind down with a mental challenge',
    icon: 'laptop',
    timeOfDay: 'evening',
  },
  {
    name: 'Reading',
    description: 'Lose yourself in a good book',
    icon: 'book',
    timeOfDay: 'evening',
  },
  {
    name: 'Evening Reflection',
    description: 'Review your day with intention',
    icon: 'leaf',
    timeOfDay: 'evening',
  },
  {
    name: 'Night Self Care',
    description: 'Take care of yourself before rest',
    icon: 'moon',
    timeOfDay: 'evening',
  },
  {
    name: 'Night Prayer',
    description: 'Connect with your spirit before sleep',
    icon: 'flame',
    timeOfDay: 'evening',
  },

  // ── Anytime ──────────────────────────────────────────────
  {
    name: 'Physical Win',
    description: 'Log one physical accomplishment today',
    icon: 'dumbbell',
    timeOfDay: 'anytime',
  },
  {
    name: 'Mental Win',
    description: 'Celebrate a mental achievement',
    icon: 'star',
    timeOfDay: 'anytime',
  },
  {
    name: 'Spiritual Win',
    description: 'Honor your spiritual growth',
    icon: 'hopeful',
    timeOfDay: 'anytime',
  },
];
