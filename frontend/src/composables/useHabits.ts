import { ref, computed } from 'vue';
import { matchEmotionIcon } from '@/utils/emotionIcon';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import { DEFAULT_HABITS } from '@/data/defaultHabits';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: MoodIconType;
  createdAt: string;
  timeOfDay: TimeOfDay;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
}

const HABITS_KEY = 'self-mastery-habits';
const COMPLETIONS_KEY = 'self-mastery-habit-completions';
const SEED_VERSION_KEY = 'self-mastery-habits-seed-version';
const CURRENT_SEED_VERSION = '1';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function seedDefaultHabits(): Habit[] {
  const now = new Date().toISOString();
  const habits: Habit[] = DEFAULT_HABITS.map((h, i) => ({
    id: `default-${Date.now().toString(36)}-${i}`,
    name: h.name,
    description: h.description,
    icon: h.icon,
    createdAt: now,
    timeOfDay: h.timeOfDay,
  }));
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
  return habits;
}

function loadHabits(): Habit[] {
  try {
    const seeded = localStorage.getItem(SEED_VERSION_KEY);
    if (!seeded || seeded !== CURRENT_SEED_VERSION) {
      return seedDefaultHabits();
    }
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) return seedDefaultHabits();
    const parsed = JSON.parse(raw) as Habit[];
    if (parsed.length === 0) return seedDefaultHabits();
    return parsed.map(h => ({ ...h, timeOfDay: h.timeOfDay || 'anytime' }));
  } catch {
    return seedDefaultHabits();
  }
}

function loadCompletions(): HabitCompletion[] {
  try {
    const raw = localStorage.getItem(COMPLETIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

function saveCompletions(completions: HabitCompletion[]) {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

const habits = ref<Habit[]>(loadHabits());
const completions = ref<HabitCompletion[]>(loadCompletions());
const selectedDate = ref<string>(todayKey());

export function useHabits() {
  const selectedCompletions = computed(() =>
    completions.value.filter(c => c.date === selectedDate.value),
  );

  const completedCount = computed(() => selectedCompletions.value.length);
  const totalCount = computed(() => habits.value.length);
  const progress = computed(() =>
    totalCount.value === 0 ? 0 : completedCount.value / totalCount.value,
  );

  function isCompletedOnDate(habitId: string): boolean {
    return selectedCompletions.value.some(c => c.habitId === habitId);
  }

  function toggleCompletion(habitId: string) {
    const date = selectedDate.value;
    const idx = completions.value.findIndex(
      c => c.habitId === habitId && c.date === date,
    );
    if (idx >= 0) {
      completions.value.splice(idx, 1);
    } else {
      completions.value.push({ habitId, date });
    }
    saveCompletions(completions.value);
  }

  function getStreak(habitId: string): number {
    let streak = 0;
    const d = new Date();
    const todayStr = todayKey();
    const hasTodayCompletion = completions.value.some(
      c => c.habitId === habitId && c.date === todayStr,
    );

    if (!hasTodayCompletion) {
      return 0;
    }

    while (true) {
      const key = d.toISOString().slice(0, 10);
      const found = completions.value.some(
        c => c.habitId === habitId && c.date === key,
      );
      if (!found) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }

    return streak;
  }

  function addHabit(name: string, description: string, timeOfDay: TimeOfDay = 'anytime', icon?: MoodIconType): Habit {
    const habit: Habit = {
      id: Date.now().toString(36),
      name: name.trim(),
      description: description.trim(),
      icon: icon ?? matchEmotionIcon(name),
      createdAt: new Date().toISOString(),
      timeOfDay,
    };
    habits.value.push(habit);
    saveHabits(habits.value);
    return habit;
  }

  function removeHabit(id: string) {
    habits.value = habits.value.filter(h => h.id !== id);
    completions.value = completions.value.filter(c => c.habitId !== id);
    saveHabits(habits.value);
    saveCompletions(completions.value);
  }

  function updateHabit(id: string, name: string, description: string, timeOfDay?: TimeOfDay, icon?: MoodIconType) {
    const habit = habits.value.find(h => h.id === id);
    if (habit) {
      habit.name = name.trim();
      habit.description = description.trim();
      habit.icon = icon ?? matchEmotionIcon(name);
      if (timeOfDay) habit.timeOfDay = timeOfDay;
      saveHabits(habits.value);
    }
  }

  return {
    habits,
    completions,
    selectedDate,
    completedCount,
    totalCount,
    progress,
    isCompletedOnDate,
    toggleCompletion,
    getStreak,
    addHabit,
    removeHabit,
    updateHabit,
  };
}
