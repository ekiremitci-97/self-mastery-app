<script setup lang="ts">
import type { MoodType } from '@self-mastery/shared';

export type MoodIconType = MoodType | 'other' | 'heart' | 'sun' | 'flame' | 'moon' | 'leaf' | 'star' | 'spiral' | 'mountain' | 'dumbbell' | 'book' | 'laptop' | 'droplet' | 'music' | 'pen' | 'coffee' | 'running';

interface Props {
  mood: MoodIconType;
  size?: 'sm' | 'md';
  bare?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  bare: false,
});
</script>

<template>
  <div
    :class="['mood-icon', `mood-icon--${size}`, { 'mood-icon--bare': bare }]"
    role="img"
    :aria-label="mood"
  >
    <!-- Low: rain cloud -->
    <svg v-if="mood === 'low'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M19 12.5a4 4 0 0 0-3.8-4A5.5 5.5 0 0 0 4.5 10.5 3.5 3.5 0 0 0 5 17h12a3 3 0 0 0 2-4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 19v2M12 19v2M16 19v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Anxious: ripple waves -->
    <svg v-else-if="mood === 'anxious'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M2 8c1.5-1.5 3-2 4.5 0s3 1.5 4.5 0 3-2 4.5 0 3 1.5 4.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 12c1.5-1.5 3-2 4.5 0s3 1.5 4.5 0 3-2 4.5 0 3 1.5 4.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 16c1.5-1.5 3-2 4.5 0s3 1.5 4.5 0 3-2 4.5 0 3 1.5 4.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Neutral: horizon with sun -->
    <svg v-else-if="mood === 'neutral'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <circle cx="12" cy="11" r="3.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 17h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Hopeful: seedling sprout -->
    <svg v-else-if="mood === 'hopeful'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M12 20v-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M12 12C12 9 9.5 6.5 6 6c0 4 2 6.5 6 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 9c0-3 2.5-5.5 6-6 0 4-2 6.5-6 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Energized: lightning bolt -->
    <svg v-else-if="mood === 'energized'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Heart: grateful, loved, caring -->
    <svg v-else-if="mood === 'heart'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Sun: happy, joyful, cheerful -->
    <svg v-else-if="mood === 'sun'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Flame: angry, frustrated, passionate -->
    <svg v-else-if="mood === 'flame'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M12 22c4.97 0 8-3.03 8-8 0-4-2.5-7-4-8.5-.5 2.5-2 3-3 3-.5-3.5-2-6-5-8.5C8.5 3 7 6.5 7 9c-1-1-2-2.5-2-5-2 3-1 6 0 8-1.5.5-3-.5-3.5-2C.5 13 2 17 5 19.5c1 .8 2.5 1.5 3.5 2 1 .3 2.2.5 3.5.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Moon: tired, sleepy, exhausted -->
    <svg v-else-if="mood === 'moon'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Leaf: peaceful, calm, serene -->
    <svg v-else-if="mood === 'leaf'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Star: excited, proud, inspired -->
    <svg v-else-if="mood === 'star'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Spiral: confused, lost, uncertain -->
    <svg v-else-if="mood === 'spiral'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 16v.01M12 12a2 2 0 0 0 .914-3.782 2 2 0 0 0-2.828.782L9.5 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Mountain: proud, strong, determined -->
    <svg v-else-if="mood === 'mountain'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M8 3l4 8 5-5 5 15H2L8 3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Dumbbell: workout, exercise -->
    <svg v-else-if="mood === 'dumbbell'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M6.5 6.5a2 2 0 0 0-3 0v11a2 2 0 0 0 3 0M17.5 6.5a2 2 0 0 1 3 0v11a2 2 0 0 1-3 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.5 12h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Book: reading, learning -->
    <svg v-else-if="mood === 'book'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Laptop: work, deep work -->
    <svg v-else-if="mood === 'laptop'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M2 20h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Droplet: water, hydration -->
    <svg v-else-if="mood === 'droplet'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Music: music, instruments -->
    <svg v-else-if="mood === 'music'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5"/>
    </svg>

    <!-- Pen: journaling, writing -->
    <svg v-else-if="mood === 'pen'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M12 20h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Coffee: morning routine -->
    <svg v-else-if="mood === 'coffee'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 2v3M10 2v3M14 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>

    <!-- Running: cardio, exercise -->
    <svg v-else-if="mood === 'running'" viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <circle cx="14" cy="4" r="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M18 22l-4-5-3 2-3-4-3 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 15l3-2 2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 10l2 2 4-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Other: pencil (fallback) -->
    <svg v-else viewBox="0 0 24 24" fill="none" class="mood-icon__svg">
      <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 5l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </div>
</template>

<style scoped>
.mood-icon {
  @apply inline-flex items-center justify-center rounded-xl bg-card-hover shrink-0;
  color: #C4A96A;
}

.mood-icon--sm {
  @apply w-8 h-8 rounded-lg;
}

.mood-icon--md {
  @apply w-10 h-10;
}

.mood-icon__svg {
  @apply w-5 h-5;
}

.mood-icon--sm .mood-icon__svg {
  @apply w-4 h-4;
}

.mood-icon--bare {
  @apply bg-transparent w-auto h-auto rounded-none;
}
</style>
