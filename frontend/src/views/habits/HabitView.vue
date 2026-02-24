<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { HabitList } from '@/components/organisms';

const router = useRouter();
const { t } = useI18n();

const handleBack = () => {
  router.push({ name: 'mood-select' });
};

const handleStats = () => {
  router.push({ name: 'stats' });
};
</script>

<template>
  <div class="habit-view">
    <nav class="habit-view__nav">
      <button class="habit-view__back" @click="handleBack">
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="habit-view__stats" @click="handleStats">
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M3 20h18M5 17l4-5 4 3 6-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="habit-view__tooltip">{{ t('habits.stats') }}</span>
      </button>
    </nav>
    <HabitList />
  </div>
</template>

<style scoped>
.habit-view {
  @apply w-full flex flex-col;
}

.habit-view__nav {
  @apply mb-4 flex items-center justify-between;
}

.habit-view__back {
  @apply w-8 h-8 rounded-full flex items-center justify-center
         text-text-secondary hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer;
}

.habit-view__stats {
  @apply w-8 h-8 rounded-full flex items-center justify-center
         text-text-secondary hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer relative;
}

.habit-view__tooltip {
  @apply absolute top-1/2 px-2 py-1 text-[10px] font-medium
         whitespace-nowrap rounded-md pointer-events-none
         opacity-0 transition-opacity;
  right: calc(100% + 6px);
  transform: translateY(-50%);
  background-color: #2D2D2D;
  color: #FFFFFF;
}

.habit-view__stats:hover .habit-view__tooltip {
  @apply opacity-100;
}
</style>
