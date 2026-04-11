<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import type { QuadrantId } from '@self-mastery/shared';
import { getEmotionsByQuadrant, getQuadrantById } from '@self-mastery/shared';

interface Props {
  quadrantId: QuadrantId;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [emotionId: string];
  back: [];
}>();

const { t } = useI18n();

const quadrant = computed(() => getQuadrantById(props.quadrantId));
const emotions = computed(() => getEmotionsByQuadrant(props.quadrantId));
</script>

<template>
  <div class="emotion-pick">
    <button class="emotion-pick__back" @click="emit('back')">
      <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <p class="emotion-pick__instruction">{{ t('mood.pickEmotion') }}</p>

    <div class="emotion-pick__list">
      <button
        v-for="emotion in emotions"
        :key="emotion.id"
        class="emotion-pick__chip"
        :style="{
          '--chip-color': quadrant?.color,
          '--chip-bg': quadrant?.color + '14',
          '--chip-border': quadrant?.color + '30',
          '--chip-hover-bg': quadrant?.color + '25',
        }"
        @click="emit('select', emotion.id)"
      >
        {{ t(emotion.labelKey) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.emotion-pick {
  @apply flex flex-col gap-5 w-full;
}

.emotion-pick__back {
  @apply w-9 h-9 rounded-full flex items-center justify-center
         text-text-secondary hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer;
}

.emotion-pick__instruction {
  @apply text-sm text-text-secondary text-center;
}

.emotion-pick__list {
  @apply flex flex-wrap justify-center gap-2.5;
}

.emotion-pick__chip {
  @apply px-5 py-2.5 rounded-pill text-sm font-medium
         transition-all duration-150 cursor-pointer;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  color: var(--chip-color);
}

.emotion-pick__chip:hover {
  background: var(--chip-hover-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.emotion-pick__chip:active {
  transform: translateY(0) scale(0.97);
}
</style>
