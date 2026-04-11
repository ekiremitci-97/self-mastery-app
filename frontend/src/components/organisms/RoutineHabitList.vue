<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  HabitCardCompact,
  HabitTemplatePicker,
  IconPicker,
  RoutineEmptyState,
  RoutineMiniStats,
} from '@/components/molecules';
import { RoutineSectionHeader, AppTabPills } from '@/components/atoms';
import { useHabits, type Habit, type TimeOfDay } from '@/composables/useHabits';
import { useHabitStats } from '@/composables/useHabitStats';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import type { HabitTemplate } from '@/data/habitTemplates';

const emit = defineEmits<{
  viewStats: [];
}>();

const { t } = useI18n();
const {
  habits,
  selectedDate,
  isCompletedOnDate,
  toggleCompletion,
  getStreak,
  addHabit,
  removeHabit,
  updateHabit,
} = useHabits();

const { completionRate, currentStreak, bestStreak } = useHabitStats();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const weekDays = computed(() => {
  const today = new Date();
  const days: { key: string; dayName: string; date: number; isToday: boolean }[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ key, dayName, date: d.getDate(), isToday: i === 0 });
  }
  return days;
});

const TIME_ORDER: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'anytime'];

const SECTION_COLORS: Record<TimeOfDay, string> = {
  morning: '#E8A948',
  afternoon: '#C4A96A',
  evening: '#8B9FD4',
  anytime: '#B5B5B5',
};

const EMPTY_KEYS: Record<TimeOfDay, string> = {
  morning: 'emptyMorning',
  afternoon: 'emptyAfternoon',
  evening: 'emptyEvening',
  anytime: 'emptyAnytime',
};

interface HabitGroup {
  timeOfDay: TimeOfDay;
  label: string;
  color: string;
  habits: Habit[];
  completed: number;
  total: number;
}

const habitGroups = computed<HabitGroup[]>(() =>
  TIME_ORDER.map(tod => {
    const groupHabits = habits.value.filter(h => h.timeOfDay === tod);
    return {
      timeOfDay: tod,
      label: t(`habits.${tod}`),
      color: SECTION_COLORS[tod],
      habits: groupHabits,
      completed: groupHabits.filter(h => isCompletedOnDate(h.id)).length,
      total: groupHabits.length,
    };
  }),
);

const hasAnyHabits = computed(() => habits.value.length > 0);

// Add-habit flow
type AddFlowState = 'idle' | 'picking-template' | 'form';

const addFlowState = ref<AddFlowState>('idle');
const addName = ref('');
const addDesc = ref('');
const addIcon = ref<MoodIconType>('star');
const addNameInput = ref<HTMLInputElement | null>(null);
const editingHabit = ref<Habit | null>(null);
const addTimeOfDay = ref<TimeOfDay>('morning');

const timeTabs = computed(() =>
  TIME_ORDER.map(tab => ({ key: tab, label: t(`habits.${tab}`) })),
);

const handleAddClick = (timeOfDay: TimeOfDay = 'morning') => {
  editingHabit.value = null;
  addName.value = '';
  addDesc.value = '';
  addTimeOfDay.value = timeOfDay;
  addIcon.value = 'star';
  addFlowState.value = 'picking-template';
};

const handleTemplateSelect = (template: HabitTemplate) => {
  addHabit(t(template.nameKey), t(template.descriptionKey), addTimeOfDay.value, template.icon);
  addFlowState.value = 'idle';
};

const handleCustomSelect = async () => {
  addName.value = '';
  addDesc.value = '';
  addIcon.value = 'star';
  addFlowState.value = 'form';
  await nextTick();
  addNameInput.value?.focus();
};

const handleAddSubmit = () => {
  const name = addName.value.trim();
  const desc = addDesc.value.trim();
  if (name) {
    if (editingHabit.value) {
      updateHabit(editingHabit.value.id, name, desc, addTimeOfDay.value, addIcon.value);
      editingHabit.value = null;
    } else {
      addHabit(name, desc, addTimeOfDay.value, addIcon.value);
    }
    addFlowState.value = 'idle';
    addName.value = '';
    addDesc.value = '';
  }
};

const handleEdit = async (habit: Habit) => {
  editingHabit.value = habit;
  addName.value = habit.name;
  addDesc.value = habit.description;
  addTimeOfDay.value = habit.timeOfDay;
  addIcon.value = habit.icon;
  addFlowState.value = 'form';
  await nextTick();
  addNameInput.value?.focus();
};

const handleFormBack = () => {
  if (editingHabit.value) {
    editingHabit.value = null;
    addFlowState.value = 'idle';
  } else {
    addFlowState.value = 'picking-template';
  }
};

const handleCancel = () => {
  editingHabit.value = null;
  addFlowState.value = 'idle';
};

const handleDelete = (id: string) => {
  removeHabit(id);
};
</script>

<template>
  <div class="routine-list">
    <!-- Day picker -->
    <div class="routine-list__days">
      <button
        v-for="day in weekDays"
        :key="day.key"
        :class="['day-cell', {
          'day-cell--selected': selectedDate === day.key,
          'day-cell--today': day.isToday && selectedDate !== day.key,
        }]"
        @click="selectedDate = day.key"
      >
        <span class="day-cell__name">{{ day.dayName }}</span>
        <span class="day-cell__date">{{ day.date }}</span>
      </button>
    </div>

    <!-- Mini stats -->
    <RoutineMiniStats
      v-if="hasAnyHabits"
      :completion-rate="completionRate"
      :current-streak="currentStreak"
      :best-streak="bestStreak"
      @view-stats="emit('viewStats')"
    />

    <!-- Grouped habit sections -->
    <div class="routine-list__sections">
      <section
        v-for="group in habitGroups"
        :key="group.timeOfDay"
        class="routine-list__section"
      >
        <RoutineSectionHeader
          :label="group.label"
          :completed-count="group.completed"
          :total-count="group.total"
          :accent-color="group.color"
        />
        <div v-if="group.habits.length > 0" class="routine-list__items">
          <HabitCardCompact
            v-for="habit in group.habits"
            :key="habit.id"
            :name="habit.name"
            :icon="habit.icon"
            :completed="isCompletedOnDate(habit.id)"
            :streak="getStreak(habit.id)"
            @toggle="toggleCompletion(habit.id)"
            @edit="handleEdit(habit)"
            @delete="handleDelete(habit.id)"
          />
        </div>
        <RoutineEmptyState
          v-else
          :message="t(`routine.${EMPTY_KEYS[group.timeOfDay]}`)"
          :show-cta="!hasAnyHabits && group.timeOfDay === 'morning'"
          @add-habit="handleAddClick(group.timeOfDay)"
        />
      </section>
    </div>

    <!-- Add habit button -->
    <div class="routine-list__add">
      <button
        v-if="addFlowState === 'idle'"
        class="add-pill"
        @click="handleAddClick()"
      >
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ t('routine.addHabit') }}
      </button>
    </div>

    <!-- Add habit overlay -->
    <div v-if="addFlowState !== 'idle'" class="routine-list__overlay">
      <div class="routine-list__overlay-backdrop" @click="handleCancel" />
      <div class="routine-list__overlay-sheet">
        <HabitTemplatePicker
          v-if="addFlowState === 'picking-template'"
          @select="handleTemplateSelect"
          @custom="handleCustomSelect"
          @cancel="handleCancel"
        />
        <div v-else class="add-form">
          <button class="add-form__back" @click="handleFormBack">
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <input
            ref="addNameInput"
            v-model="addName"
            :placeholder="t('habits.namePlaceholder')"
            maxlength="30"
            class="add-form__field add-form__field--name"
            @keydown.enter="handleAddSubmit"
          />
          <span class="add-form__sep" />
          <input
            v-model="addDesc"
            :placeholder="t('habits.descPlaceholder')"
            maxlength="60"
            class="add-form__field add-form__field--desc"
            @keydown.enter="handleAddSubmit"
          />
          <AppTabPills
            :tabs="timeTabs"
            :active-key="addTimeOfDay"
            size="sm"
            class="add-form__time-row"
            @select="addTimeOfDay = $event as TimeOfDay"
          />
          <IconPicker v-model="addIcon" />
          <div v-if="addName.trim()" class="add-form__buttons">
            <button class="add-form__btn" @click="handleAddSubmit">
              <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.routine-list {
  @apply flex flex-col gap-3 w-full flex-1;
  min-height: 0;
}

.routine-list__days {
  @apply flex items-center justify-between gap-1;
}

.day-cell {
  @apply flex flex-col items-center justify-center gap-0.5 w-10 h-14
         rounded-xl cursor-pointer transition-all border border-transparent;
}

.day-cell--selected {
  border-color: #C4A96A;
  background-color: rgba(196, 169, 106, 0.12);
}

.day-cell--today {
  @apply border-border;
}

.day-cell__name {
  @apply text-[10px] font-medium text-text-muted font-mono uppercase tracking-wide;
}

.day-cell__date {
  @apply text-sm font-semibold text-text-primary;
}

.day-cell--selected .day-cell__name {
  color: #C4A96A;
}

.day-cell--selected .day-cell__date {
  color: #C4A96A;
}

.routine-list__sections {
  @apply flex flex-col gap-4 flex-1 overflow-y-auto;
  min-height: 0;
  scrollbar-width: none;
}

.routine-list__sections::-webkit-scrollbar {
  display: none;
}

.routine-list__section {
  @apply flex flex-col gap-1.5;
}

.routine-list__items {
  @apply flex flex-col gap-2;
}

.routine-list__add {
  @apply flex justify-center pt-1;
}

.add-pill {
  @apply pl-1.5 pr-4 py-1.5 text-xs border border-border rounded-pill
         bg-transparent hover:bg-card-hover transition-colors cursor-pointer
         inline-flex items-center gap-2;
  color: #C4A96A;
}

/* Overlay */
.routine-list__overlay {
  @apply fixed inset-0 z-30 flex items-end justify-center;
}

.routine-list__overlay-backdrop {
  @apply absolute inset-0;
  background-color: rgba(45, 45, 45, 0.3);
  backdrop-filter: blur(4px);
}

.routine-list__overlay-sheet {
  @apply relative w-full max-w-md bg-background border-t border-border rounded-t-3xl
         px-5 pt-5 pb-8 max-h-[80vh] overflow-y-auto;
  scrollbar-width: none;
}

.routine-list__overlay-sheet::-webkit-scrollbar {
  display: none;
}

/* Add form */
.add-form {
  @apply relative flex flex-col gap-0 w-full px-4 py-3 border border-border rounded-2xl bg-card;
}

.add-form__back {
  @apply w-6 h-6 rounded-lg flex items-center justify-center mb-1
         text-text-muted hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer;
}

.add-form__field {
  @apply bg-transparent border-none outline-none w-full text-sm;
}

.add-form__field--name {
  @apply font-semibold text-text-primary placeholder-text-muted pb-2;
}

.add-form__field--desc {
  @apply text-text-secondary placeholder-text-muted pt-2;
}

.add-form__sep {
  @apply h-px w-full bg-border;
}

.add-form__time-row {
  @apply pt-3;
}

.add-form__buttons {
  @apply absolute bottom-3 right-3;
}

.add-form__btn {
  @apply w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors;
  background-color: #C4A96A;
  color: white;
}

.add-form__btn:hover {
  background-color: #b89a5a;
}
</style>
