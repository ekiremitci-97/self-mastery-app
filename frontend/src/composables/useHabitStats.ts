import { ref, computed } from 'vue';
import { useHabits, type HabitCompletion } from './useHabits';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';

export type StatsPeriod = 'week' | 'month' | '6m' | 'year';

export interface BarDataPoint {
  label: string;
  value: number;
}

export interface HabitStat {
  id: string;
  name: string;
  icon: MoodIconType;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  while (d <= endDay) {
    dates.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function getDateRange(period: StatsPeriod): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  switch (period) {
    case 'week':
      start.setDate(start.getDate() - 6);
      break;
    case 'month':
      start.setDate(start.getDate() - 29);
      break;
    case '6m':
      start.setMonth(start.getMonth() - 6);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }
  return { start, end };
}

function computeBestStreak(completionDates: Set<string>): number {
  if (completionDates.size === 0) return 0;
  const sorted = [...completionDates].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}

function computeCurrentStreak(completionDates: Set<string>): number {
  const today = formatDate(new Date());
  if (!completionDates.has(today)) return 0;
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = formatDate(d);
    if (!completionDates.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function useHabitStats() {
  const { habits, completions } = useHabits();
  const activePeriod = ref<StatsPeriod>('week');

  const chartData = computed<BarDataPoint[]>(() => {
    const { start, end } = getDateRange(activePeriod.value);
    const habitCount = habits.value.length;
    if (habitCount === 0) return [];

    const startStr = formatDate(start);
    const endStr = formatDate(end);
    const inRange = completions.value.filter(
      c => c.date >= startStr && c.date <= endStr,
    );

    if (activePeriod.value === 'week' || activePeriod.value === 'month') {
      const dates = getDatesInRange(start, end);
      return dates.map(dateStr => {
        const count = inRange.filter(c => c.date === dateStr).length;
        const d = new Date(dateStr);
        const label =
          activePeriod.value === 'week'
            ? d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)
            : d.getDate().toString();
        return { label, value: Math.min(count / habitCount, 1) };
      });
    }

    if (activePeriod.value === '6m') {
      const dates = getDatesInRange(start, end);
      const weeks: { label: string; dates: string[] }[] = [];
      for (let i = 0; i < dates.length; i += 7) {
        const weekDates = dates.slice(i, i + 7);
        const d = new Date(weekDates[0]);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        weeks.push({ label: weeks.length % 4 === 0 ? label : '', dates: weekDates });
      }
      return weeks.map(w => {
        const count = inRange.filter(c => w.dates.includes(c.date)).length;
        const maxPossible = w.dates.length * habitCount;
        return { label: w.label, value: maxPossible > 0 ? Math.min(count / maxPossible, 1) : 0 };
      });
    }

    // year: bucket by month
    const months: { label: string; dates: string[] }[] = [];
    const cursor = new Date(start);
    cursor.setDate(1);
    while (cursor <= end) {
      const monthStart = new Date(cursor);
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      const actualStart = monthStart < start ? start : monthStart;
      const actualEnd = monthEnd > end ? end : monthEnd;
      const dates = getDatesInRange(actualStart, actualEnd);
      const label = cursor.toLocaleDateString('en-US', { month: 'short' });
      months.push({ label, dates });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return months.map(m => {
      const count = inRange.filter(c => m.dates.includes(c.date)).length;
      const maxPossible = m.dates.length * habitCount;
      return { label: m.label, value: maxPossible > 0 ? Math.min(count / maxPossible, 1) : 0 };
    });
  });

  const completionRate = computed(() => {
    const { start, end } = getDateRange(activePeriod.value);
    const habitCount = habits.value.length;
    if (habitCount === 0) return 0;
    const dates = getDatesInRange(start, end);
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    const inRange = completions.value.filter(
      c => c.date >= startStr && c.date <= endStr,
    );
    const maxPossible = dates.length * habitCount;
    return maxPossible > 0 ? Math.min(inRange.length / maxPossible, 1) : 0;
  });

  const totalCompletions = computed(() => {
    const { start, end } = getDateRange(activePeriod.value);
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    return completions.value.filter(
      c => c.date >= startStr && c.date <= endStr,
    ).length;
  });

  const currentStreak = computed(() => {
    const allDates = new Set(completions.value.map(c => c.date));
    return computeCurrentStreak(allDates);
  });

  const bestStreak = computed(() => {
    const allDates = new Set(completions.value.map(c => c.date));
    return computeBestStreak(allDates);
  });

  const perHabitStats = computed<HabitStat[]>(() => {
    const { start, end } = getDateRange(activePeriod.value);
    const dates = getDatesInRange(start, end);
    const totalDays = dates.length;
    const startStr = formatDate(start);
    const endStr = formatDate(end);

    return habits.value
      .map(habit => {
        const habitCompletions = completions.value.filter(
          c => c.habitId === habit.id,
        );
        const inRange = habitCompletions.filter(
          c => c.date >= startStr && c.date <= endStr,
        );
        const rate = totalDays > 0 ? Math.min(inRange.length / totalDays, 1) : 0;
        const habitDates = new Set(habitCompletions.map(c => c.date));
        return {
          id: habit.id,
          name: habit.name,
          icon: habit.icon,
          completionRate: rate,
          currentStreak: computeCurrentStreak(habitDates),
          bestStreak: computeBestStreak(habitDates),
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);
  });

  return {
    activePeriod,
    chartData,
    completionRate,
    totalCompletions,
    currentStreak,
    bestStreak,
    perHabitStats,
  };
}
