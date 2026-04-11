<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
}

defineProps<Props>();

const emit = defineEmits<{
  viewStats: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="mini-stats">
    <div class="mini-stats__row">
      <span class="mini-stats__item">
        {{ t('routine.rateLabel', { rate: Math.round(completionRate * 100) }) }}
      </span>
      <span class="mini-stats__dot">&middot;</span>
      <span class="mini-stats__item">
        {{ t('routine.streakLabel', { count: currentStreak }) }}
      </span>
      <span class="mini-stats__dot">&middot;</span>
      <span class="mini-stats__item">
        {{ t('routine.bestStreakLabel', { count: bestStreak }) }}
      </span>
      <button class="mini-stats__link" @click="emit('viewStats')">
        {{ t('routine.seeAll') }}
        <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mini-stats {
  @apply py-1;
}

.mini-stats__row {
  @apply flex items-center gap-1.5 flex-wrap;
}

.mini-stats__item {
  @apply text-[11px] font-mono text-text-muted;
}

.mini-stats__dot {
  @apply text-text-muted text-[11px];
}

.mini-stats__link {
  @apply ml-auto flex items-center gap-1 text-[11px] font-medium
         transition-colors cursor-pointer;
  color: #C4A96A;
}

.mini-stats__link:hover {
  opacity: 0.8;
}
</style>
