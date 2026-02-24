<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHabitStats, type StatsPeriod } from '@/composables/useHabitStats';
import { AppBarChart, AppCard, AppProgressRing, AppMoodIcon } from '@/components/atoms';

const router = useRouter();
const { t } = useI18n();
const {
  activePeriod,
  chartData,
  completionRate,
  totalCompletions,
  currentStreak,
  bestStreak,
  perHabitStats,
} = useHabitStats();

const periods: { key: StatsPeriod; labelKey: string }[] = [
  { key: 'week', labelKey: 'stats.week' },
  { key: 'month', labelKey: 'stats.month' },
  { key: '6m', labelKey: 'stats.sixMonths' },
  { key: 'year', labelKey: 'stats.year' },
];

const handleBack = () => {
  router.push({ name: 'habits' });
};
</script>

<template>
  <div class="stats-view">
    <nav class="stats-view__nav">
      <button class="stats-view__back" @click="handleBack">
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="stats-view__title">{{ t('stats.title') }}</h1>
    </nav>

    <div class="stats-view__tabs">
      <button
        v-for="period in periods"
        :key="period.key"
        :class="['tab-pill', { 'tab-pill--active': activePeriod === period.key }]"
        @click="activePeriod = period.key"
      >
        {{ t(period.labelKey) }}
      </button>
    </div>

    <template v-if="perHabitStats.length > 0">
      <AppCard class="stats-view__chart-card">
        <AppBarChart :data="chartData" :height="120" />
      </AppCard>

      <div class="stats-view__summary">
        <AppCard class="stats-view__stat">
          <AppProgressRing :progress="completionRate" :size="48" :stroke-width="4" />
          <div class="stats-view__stat-text">
            <span class="stats-view__stat-value">{{ Math.round(completionRate * 100) }}%</span>
            <span class="stats-view__stat-label">{{ t('stats.completionRate') }}</span>
          </div>
        </AppCard>
        <div class="stats-view__stat-grid">
          <AppCard class="stats-view__stat-mini">
            <span class="stats-view__stat-value">{{ currentStreak }}</span>
            <span class="stats-view__stat-label">{{ t('stats.currentStreak') }}</span>
          </AppCard>
          <AppCard class="stats-view__stat-mini">
            <span class="stats-view__stat-value">{{ bestStreak }}</span>
            <span class="stats-view__stat-label">{{ t('stats.bestStreak') }}</span>
          </AppCard>
          <AppCard class="stats-view__stat-mini">
            <span class="stats-view__stat-value">{{ totalCompletions }}</span>
            <span class="stats-view__stat-label">{{ t('stats.totalDone') }}</span>
          </AppCard>
        </div>
      </div>

      <div class="stats-view__habits">
        <h2 class="stats-view__section-title">{{ t('stats.perHabit') }}</h2>
        <AppCard
          v-for="stat in perHabitStats"
          :key="stat.id"
          class="habit-stat-card"
        >
          <div class="habit-stat-card__header">
            <AppMoodIcon :mood="stat.icon" size="sm" bare />
            <span class="habit-stat-card__name">{{ stat.name }}</span>
            <span class="habit-stat-card__rate">{{ Math.round(stat.completionRate * 100) }}%</span>
          </div>
          <div class="habit-stat-card__bar-bg">
            <div
              class="habit-stat-card__bar-fill"
              :style="{ width: `${stat.completionRate * 100}%` }"
            />
          </div>
          <div class="habit-stat-card__meta">
            <span>{{ t('stats.streak', { count: stat.currentStreak }) }}</span>
            <span>{{ t('stats.best', { count: stat.bestStreak }) }}</span>
          </div>
        </AppCard>
      </div>
    </template>

    <div v-else class="stats-view__empty">
      <p class="stats-view__empty-text">{{ t('stats.noData') }}</p>
    </div>
  </div>
</template>

<style scoped>
.stats-view {
  @apply w-full flex flex-col gap-4;
}

.stats-view__nav {
  @apply flex items-center gap-3 mb-2;
}

.stats-view__back {
  @apply w-8 h-8 rounded-full flex items-center justify-center
         text-text-secondary hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer;
}

.stats-view__title {
  @apply text-xl font-bold font-serif text-text-primary;
}

.stats-view__tabs {
  @apply flex items-center gap-2;
}

.tab-pill {
  @apply px-4 py-1.5 text-xs font-medium rounded-pill border border-border
         bg-transparent text-text-secondary transition-all cursor-pointer;
}

.tab-pill--active {
  @apply text-white border-transparent;
  background-color: #C4A96A;
}

.tab-pill:not(.tab-pill--active):hover {
  @apply bg-card-hover;
}

.stats-view__chart-card {
  @apply p-4;
}

.stats-view__summary {
  @apply flex flex-col gap-3;
}

.stats-view__stat {
  @apply flex items-center gap-4 p-4;
}

.stats-view__stat-text {
  @apply flex flex-col;
}

.stats-view__stat-value {
  @apply text-lg font-bold font-serif text-text-primary;
}

.stats-view__stat-label {
  @apply text-[11px] text-text-muted;
}

.stats-view__stat-grid {
  @apply grid grid-cols-3 gap-2;
}

.stats-view__stat-mini {
  @apply flex flex-col items-center justify-center py-3 px-2 text-center;
}

.stats-view__stat-mini .stats-view__stat-value {
  @apply text-base;
}

.stats-view__section-title {
  @apply text-xs font-semibold text-text-muted uppercase tracking-wider mb-1;
}

.stats-view__habits {
  @apply flex flex-col gap-2;
}

.stats-view__empty {
  @apply flex flex-col items-center py-12;
}

.stats-view__empty-text {
  @apply text-sm text-text-muted;
}

/* Per-habit stat card */
.habit-stat-card {
  @apply p-3 flex flex-col gap-2;
}

.habit-stat-card__header {
  @apply flex items-center gap-2;
}

.habit-stat-card__name {
  @apply text-sm font-medium text-text-primary flex-1;
}

.habit-stat-card__rate {
  @apply text-sm font-bold font-serif;
  color: #C4A96A;
}

.habit-stat-card__bar-bg {
  @apply w-full h-1.5 rounded-full;
  background-color: #E8E4DC;
}

.habit-stat-card__bar-fill {
  @apply h-full rounded-full;
  background-color: #C4A96A;
  transition: width 0.5s ease;
}

.habit-stat-card__meta {
  @apply flex items-center gap-3 text-[11px] text-text-muted;
}
</style>
