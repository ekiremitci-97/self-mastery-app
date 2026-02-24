<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { HabitCard, HabitTemplatePicker, IconPicker } from '@/components/molecules';
import { AppProgressRing } from '@/components/atoms';
import { useHabits, type Habit, type TimeOfDay } from '@/composables/useHabits';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import type { HabitTemplate } from '@/data/habitTemplates';
import { getTimeOfDayKey } from '@/utils/greeting';

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

const isToday = computed(() => selectedDate.value === todayKey());

const TIME_TABS: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'anytime'];

const initTab = (): TimeOfDay => {
  const key = getTimeOfDayKey();
  return key as TimeOfDay;
};

const activeTab = ref<TimeOfDay>(initTab());

const filteredHabits = computed(() =>
  habits.value.filter(h => h.timeOfDay === activeTab.value),
);

const dailyCompleted = computed(() =>
  habits.value.filter(h => isCompletedOnDate(h.id)).length,
);

const dailyTotal = computed(() => habits.value.length);

const dailyProgress = computed(() =>
  dailyTotal.value === 0 ? 0 : dailyCompleted.value / dailyTotal.value,
);

const emptyKey = computed(() => {
  const map: Record<TimeOfDay, string> = {
    morning: 'emptyMorning',
    afternoon: 'emptyAfternoon',
    evening: 'emptyEvening',
    anytime: 'emptyAnytime',
  };
  return map[activeTab.value];
});

type AddFlowState = 'idle' | 'picking-template' | 'form';

const addFlowState = ref<AddFlowState>('idle');
const addName = ref('');
const addDesc = ref('');
const addIcon = ref<MoodIconType>('star');
const addNameInput = ref<HTMLInputElement | null>(null);
const editingHabit = ref<Habit | null>(null);
const addTimeOfDay = ref<TimeOfDay>(activeTab.value);

const handleAddClick = () => {
  editingHabit.value = null;
  addName.value = '';
  addDesc.value = '';
  addTimeOfDay.value = activeTab.value;
  addIcon.value = 'star';
  addFlowState.value = 'picking-template';
};

const handleTemplateSelect = (template: HabitTemplate) => {
  addHabit(t(template.nameKey), t(template.descriptionKey), activeTab.value, template.icon);
  addFlowState.value = 'idle';
};

const handleCustomSelect = async () => {
  addName.value = '';
  addDesc.value = '';
  addTimeOfDay.value = activeTab.value;
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

const handleDelete = (id: string) => {
  removeHabit(id);
};
</script>

<template>
  <div class="habit-list">
    <div class="habit-list__header">
      <div class="habit-list__title-row">
        <div>
          <h1 class="habit-list__title">{{ t('habits.title') }}</h1>
          <p v-if="dailyTotal > 0" class="habit-list__subtitle">
            {{ t('habits.progress', { done: dailyCompleted, total: dailyTotal }) }}
          </p>
          <p v-else class="habit-list__subtitle">{{ t('habits.emptySubtitle') }}</p>
        </div>
        <AppProgressRing v-if="dailyTotal > 0" :progress="dailyProgress" />
      </div>
    </div>

    <div class="habit-list__days">
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

    <div class="habit-list__tabs">
      <button
        v-for="tab in TIME_TABS"
        :key="tab"
        :class="['tab-pill', { 'tab-pill--active': activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ t(`habits.${tab}`) }}
      </button>
    </div>

    <div v-if="filteredHabits.length > 0" class="habit-list__items">
      <HabitCard
        v-for="habit in filteredHabits"
        :key="habit.id"
        :name="habit.name"
        :description="habit.description"
        :icon="habit.icon"
        :completed="isCompletedOnDate(habit.id)"
        :streak="getStreak(habit.id)"
        @toggle="toggleCompletion(habit.id)"
        @edit="handleEdit(habit)"
        @delete="handleDelete(habit.id)"
      />
    </div>

    <div v-else class="habit-list__empty">
      <p class="habit-list__empty-text">{{ t(`habits.${emptyKey}`) }}</p>
    </div>

    <div class="habit-list__add">
      <button
        v-if="addFlowState === 'idle'"
        class="add-pill"
        @click="handleAddClick"
      >
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ t('habits.addHabit') }}
      </button>

      <HabitTemplatePicker
        v-else-if="addFlowState === 'picking-template'"
        @select="handleTemplateSelect"
        @custom="handleCustomSelect"
        @cancel="addFlowState = 'idle'"
      />

      <div v-else class="add-input-box">
        <button class="add-input-box__back" @click="handleFormBack">
          <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <input
          ref="addNameInput"
          v-model="addName"
          :placeholder="t('habits.namePlaceholder')"
          maxlength="30"
          class="add-input-box__field add-input-box__field--name"
          @keydown.enter="handleAddSubmit"
        />
        <span class="add-input-box__sep" />
        <input
          v-model="addDesc"
          :placeholder="t('habits.descPlaceholder')"
          maxlength="60"
          class="add-input-box__field add-input-box__field--desc"
          @keydown.enter="handleAddSubmit"
        />
        <div class="add-input-box__time-row">
          <button
            v-for="tab in TIME_TABS"
            :key="tab"
            :class="['time-pill', { 'time-pill--active': addTimeOfDay === tab }]"
            @click="addTimeOfDay = tab"
          >
            {{ t(`habits.${tab}`) }}
          </button>
        </div>
        <IconPicker v-model="addIcon" />
        <div v-if="addName.trim()" class="add-input-box__buttons">
          <button
            class="add-input-box__btn"
            @click="handleAddSubmit"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habit-list {
  @apply flex flex-col gap-4 w-full;
}

.habit-list__header {
  @apply text-center;
}

.habit-list__title-row {
  @apply flex items-center justify-between;
}

.habit-list__title {
  @apply text-2xl font-bold font-serif text-text-primary mb-0.5 text-left;
}

.habit-list__subtitle {
  @apply text-sm text-text-secondary text-left;
}

.habit-list__tabs {
  @apply flex items-center justify-center gap-2;
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

.habit-list__items {
  @apply flex flex-col gap-2;
}

.habit-list__empty {
  @apply flex flex-col items-center py-8;
}

.habit-list__empty-text {
  @apply text-sm text-text-muted;
}

.habit-list__add {
  @apply flex justify-center;
}

.add-pill {
  @apply pl-1.5 pr-4 py-1.5 text-xs text-accent border border-border rounded-pill
         bg-transparent hover:bg-card-hover transition-colors cursor-pointer
         inline-flex items-center gap-2;
}

.add-input-box {
  @apply relative flex flex-col gap-0 w-full px-4 py-3 border border-border rounded-2xl bg-card;
}

.add-input-box__back {
  @apply w-6 h-6 rounded-lg flex items-center justify-center mb-1
         text-text-muted hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer;
}

.add-input-box__field {
  @apply bg-transparent border-none outline-none w-full text-sm;
}

.add-input-box__field--name {
  @apply font-semibold text-text-primary placeholder-text-muted pb-2;
}

.add-input-box__field--desc {
  @apply text-text-secondary placeholder-text-muted pt-2;
}

.add-input-box__sep {
  @apply h-px w-full bg-border;
}

.add-input-box__time-row {
  @apply flex items-center gap-1.5 pt-3;
}

.time-pill {
  @apply px-3 py-1 text-[10px] font-medium rounded-pill border border-border
         bg-transparent text-text-muted transition-all cursor-pointer;
}

.time-pill--active {
  @apply text-white border-transparent;
  background-color: #C4A96A;
}

.time-pill:not(.time-pill--active):hover {
  @apply bg-card-hover;
}

.add-input-box__buttons {
  @apply absolute bottom-3 right-3;
}

.add-input-box__btn {
  @apply w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors;
  background-color: #C4A96A;
  color: white;
}

.add-input-box__btn:hover {
  background-color: #b89a5a;
}

.habit-list__days {
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
  @apply text-[10px] font-medium text-text-muted uppercase tracking-wide;
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
</style>
