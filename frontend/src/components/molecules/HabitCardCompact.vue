<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AppMoodIcon, AppCheckCircle } from '@/components/atoms';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import HabitOverflowMenu from './HabitOverflowMenu.vue';

interface Props {
  name: string;
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
const menuOpen = ref(false);

const handleEdit = () => {
  menuOpen.value = false;
  emit('edit');
};

const handleDelete = () => {
  menuOpen.value = false;
  emit('delete');
};
</script>

<template>
  <div :class="['habit-compact', { 'habit-compact--done': completed }]">
    <div class="habit-compact__body">
      <AppMoodIcon :mood="icon" size="sm" />
      <span :class="['habit-compact__name', { 'habit-compact__name--done': completed }]">
        {{ name }}
      </span>
      <div class="habit-compact__right">
        <div class="habit-compact__overflow-wrap">
          <button
            class="habit-compact__dots"
            :aria-label="t('habits.edit')"
            @click.stop="menuOpen = !menuOpen"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          <HabitOverflowMenu
            v-if="menuOpen"
            :streak="streak"
            @edit="handleEdit"
            @delete="handleDelete"
            @close="menuOpen = false"
          />
        </div>
        <AppCheckCircle :checked="completed" @toggle="emit('toggle')" />
      </div>
    </div>
    <div v-if="completed" class="habit-compact__bar" />
  </div>
</template>

<style scoped>
.habit-compact {
  @apply relative w-full bg-card border border-border rounded-2xl transition-all;
}

.habit-compact--done {
  @apply opacity-80;
}

.habit-compact__body {
  @apply flex items-center gap-3 px-4 py-2.5;
}

.habit-compact__name {
  @apply text-sm font-semibold text-text-primary flex-1 min-w-0 truncate transition-all;
}

.habit-compact__name--done {
  @apply line-through opacity-60;
}

.habit-compact__right {
  @apply flex items-center gap-1.5 shrink-0;
}

.habit-compact__overflow-wrap {
  @apply relative;
}

.habit-compact__dots {
  @apply w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer;
  color: #B5B5B5;
}

.habit-compact__dots:hover {
  @apply bg-card-hover;
  color: #8A8A8A;
}

.habit-compact__bar {
  @apply w-full h-0.5 rounded-b-2xl;
  background-color: #C4A96A;
}
</style>
