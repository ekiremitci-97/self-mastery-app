<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AppProgressRing } from '@/components/atoms';

interface Props {
  completed: number;
  total: number;
  progress: number;
  currentStreak: number;
}

defineProps<Props>();

const { t } = useI18n();
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__text">
      <h1 class="dashboard__title">{{ t('routine.title') }}</h1>
      <p class="dashboard__subtitle">
        <span>{{ t('routine.progress', { done: completed, total }) }}</span>
        <span v-if="currentStreak > 0" class="dashboard__dot">&middot;</span>
        <span v-if="currentStreak > 0" class="dashboard__streak">
          <svg viewBox="0 0 24 24" fill="none" class="w-2.5 h-2.5 inline-block">
            <path d="M12 2c.5 3.5 4 6 4 10a4 4 0 1 1-8 0c0-4 3.5-6.5 4-10z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ t('routine.streakLabel', { count: currentStreak }) }}
        </span>
      </p>
    </div>
    <AppProgressRing v-if="total > 0" :progress="progress" />
  </div>
</template>

<style scoped>
.dashboard {
  @apply flex items-center justify-between;
}

.dashboard__text {
  @apply flex flex-col;
}

.dashboard__title {
  @apply text-xl font-bold font-serif text-text-primary mb-0.5;
}

.dashboard__subtitle {
  @apply text-xs text-text-secondary font-mono flex items-center gap-1.5;
}

.dashboard__dot {
  @apply text-text-muted;
}

.dashboard__streak {
  @apply flex items-center gap-0.5;
  color: #C4A96A;
}
</style>
