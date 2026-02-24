<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AppMoodIcon } from '@/components/atoms';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import { ALL_ICONS } from '@/data/habitTemplates';

interface Props {
  modelValue: MoodIconType;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [icon: MoodIconType];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="icon-picker">
    <span class="icon-picker__label">{{ t('habits.chooseIcon') }}</span>
    <div class="icon-picker__grid">
      <button
        v-for="iconOption in ALL_ICONS"
        :key="iconOption.type"
        :class="['icon-option', { 'icon-option--active': modelValue === iconOption.type }]"
        @click="emit('update:modelValue', iconOption.type)"
      >
        <AppMoodIcon :mood="iconOption.type" size="sm" :bare="true" />
        <span class="icon-option__tooltip">{{ t(iconOption.labelKey) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.icon-picker {
  @apply flex flex-col gap-1.5 pt-3;
}

.icon-picker__label {
  @apply text-[10px] text-text-muted font-medium;
}

.icon-picker__grid {
  @apply flex flex-wrap gap-1.5;
}

.icon-option {
  @apply w-8 h-8 rounded-lg flex items-center justify-center
         border border-border bg-transparent
         transition-all cursor-pointer relative;
}

.icon-option:hover {
  @apply bg-card-hover;
}

.icon-option--active {
  @apply border-transparent;
  background-color: rgba(196, 169, 106, 0.15);
}

.icon-option__tooltip {
  @apply absolute -top-8 left-1/2 px-2 py-1 text-[10px] font-medium
         whitespace-nowrap rounded-md pointer-events-none
         opacity-0 transition-opacity;
  transform: translateX(-50%);
  background-color: #2D2D2D;
  color: #FFFFFF;
}

.icon-option:hover .icon-option__tooltip {
  @apply opacity-100;
}
</style>
