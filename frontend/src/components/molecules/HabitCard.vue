<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AppMoodIcon, AppCheckCircle } from '@/components/atoms';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';

interface Props {
  name: string;
  description: string;
  icon: MoodIconType;
  completed: boolean;
  streak: number;
}

defineProps<Props>();

const emit = defineEmits<{
  toggle: [];
  edit: [];
  delete: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div :class="['habit-card', { 'habit-card--done': completed }]">
    <div class="habit-card__body">
      <AppMoodIcon :mood="icon" size="sm" />
      <div class="habit-card__text">
        <span :class="['habit-card__name', { 'habit-card__name--done': completed }]">{{ name }}</span>
        <span v-if="completed" class="habit-card__status habit-card__status--done">
          <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ t('habits.done') }}
        </span>
        <span v-else class="habit-card__status habit-card__status--go">
          <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ t('habits.goForIt') }}
        </span>
      </div>
      <div class="habit-card__right">
        <span v-if="streak > 0" class="habit-card__streak">
          {{ t('habits.streakDays', { count: streak }) }}
        </span>
        <div class="habit-card__actions">
          <button class="habit-card__action" @click.stop="emit('edit')">
            <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
              <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 5l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="habit-card__tooltip">{{ t('habits.edit') }}</span>
          </button>
          <button class="habit-card__action habit-card__action--delete" @click.stop="emit('delete')">
            <svg viewBox="0 0 24 24" fill="none" class="w-3 h-3">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="habit-card__tooltip">{{ t('habits.delete') }}</span>
          </button>
        </div>
        <AppCheckCircle :checked="completed" @toggle="emit('toggle')" />
      </div>
    </div>
    <div v-if="completed" class="habit-card__bar" />
  </div>
</template>

<style scoped>
.habit-card {
  @apply relative w-full bg-card border border-border rounded-2xl transition-all;
}

.habit-card--done {
  @apply opacity-80;
}

.habit-card__body {
  @apply flex items-center gap-3 px-4 py-2.5;
}

.habit-card__text {
  @apply flex flex-col flex-1 min-w-0;
}

.habit-card__name {
  @apply text-sm font-semibold text-text-primary transition-all;
}

.habit-card__name--done {
  @apply line-through opacity-60;
}

.habit-card__status {
  @apply flex items-center gap-1 text-xs mt-0.5;
}

.habit-card__status--go {
  color: #C4A96A;
}

.habit-card__status--done {
  @apply text-text-muted;
}

.habit-card__right {
  @apply flex items-center gap-2 shrink-0;
}

.habit-card__streak {
  @apply text-xs font-medium whitespace-nowrap;
  color: #C4A96A;
}

.habit-card__actions {
  @apply flex items-center gap-0.5;
}

.habit-card__action {
  @apply w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer relative;
  color: #C4A96A;
}

.habit-card__tooltip {
  @apply absolute -top-8 left-1/2 px-2 py-1 text-[10px] font-medium
         whitespace-nowrap rounded-md pointer-events-none
         opacity-0 transition-opacity z-10;
  transform: translateX(-50%);
  background-color: #2D2D2D;
  color: #FFFFFF;
}

.habit-card__action:hover .habit-card__tooltip {
  @apply opacity-100;
}

.habit-card__action:hover {
  @apply bg-card-hover;
}

.habit-card__action--delete:hover {
  color: #c97a7a;
}

.habit-card__bar {
  @apply w-full h-0.5 rounded-b-2xl;
  background-color: #C4A96A;
}
</style>
