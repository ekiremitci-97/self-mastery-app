<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RoutineDashboard } from '@/components/molecules';
import { RoutineHabitList } from '@/components/organisms';
import { useHabits } from '@/composables/useHabits';
import { useHabitStats } from '@/composables/useHabitStats';

const router = useRouter();
const { completedCount, totalCount, progress } = useHabits();
const { currentStreak } = useHabitStats();

const handleViewStats = () => {
  router.push({ name: 'stats' });
};
</script>

<template>
  <div class="habit-view">
    <RoutineDashboard
      :completed="completedCount"
      :total="totalCount"
      :progress="progress"
      :current-streak="currentStreak"
    />
    <RoutineHabitList @view-stats="handleViewStats" />
  </div>
</template>

<style scoped>
.habit-view {
  @apply w-full flex flex-col gap-3 flex-1;
  min-height: 0;
}
</style>
