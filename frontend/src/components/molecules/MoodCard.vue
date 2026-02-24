<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AppMoodIcon } from '@/components/atoms';
import type { MoodOption } from '@self-mastery/shared';

interface Props {
  option: MoodOption;
  selected?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  select: [];
}>();

const { t } = useI18n();
</script>

<template>
  <button
    :class="['mood-card', { 'mood-card--selected': selected }]"
    @click="emit('select')"
  >
    <AppMoodIcon :mood="option.type" size="md" />
    <div class="mood-card__text">
      <span class="mood-card__label">{{ t(option.labelKey) }}</span>
      <span class="mood-card__desc">{{ t(option.descriptionKey) }}</span>
    </div>
  </button>
</template>

<style scoped>
.mood-card {
  @apply flex items-center gap-3 w-full px-4 py-3 bg-card border border-border rounded-2xl
         cursor-pointer hover:bg-card-hover transition-all text-left;
}

.mood-card--selected {
  @apply border-text-secondary bg-card-hover;
}

.mood-card__text {
  @apply flex flex-col;
}

.mood-card__label {
  @apply text-sm font-semibold text-text-primary;
}

.mood-card__desc {
  @apply text-xs text-text-secondary;
}
</style>
