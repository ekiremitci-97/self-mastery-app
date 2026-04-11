<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MoodQuadrant, EmotionGrid } from '@/components/molecules';
import type { QuadrantId } from '@self-mastery/shared';

const emit = defineEmits<{
  select: [emotionId: string, quadrant: QuadrantId];
}>();

const { t } = useI18n();

type Step = 'quadrant' | 'emotion';

const step = ref<Step>('quadrant');
const selectedQuadrant = ref<QuadrantId | null>(null);

function handleQuadrantSelect(quadrantId: QuadrantId) {
  selectedQuadrant.value = quadrantId;
  step.value = 'emotion';
}

function handleEmotionSelect(emotionId: string) {
  if (selectedQuadrant.value) {
    emit('select', emotionId, selectedQuadrant.value);
  }
}

function handleBack() {
  step.value = 'quadrant';
  selectedQuadrant.value = null;
}
</script>

<template>
  <div class="mood-selector">
    <div class="mood-selector__header">
      <h1 class="mood-selector__title">{{ t('mood.title') }}</h1>
      <p v-if="step === 'quadrant'" class="mood-selector__subtitle">{{ t('mood.subtitle') }}</p>
      <p v-else class="mood-selector__subtitle">{{ t('mood.subtitleEmotion') }}</p>
    </div>

    <Transition name="fade" mode="out-in">
      <MoodQuadrant
        v-if="step === 'quadrant'"
        key="quadrant"
        @select="handleQuadrantSelect"
      />
      <EmotionGrid
        v-else
        key="emotion"
        :quadrant-id="selectedQuadrant!"
        @select="handleEmotionSelect"
        @back="handleBack"
      />
    </Transition>
  </div>
</template>

<style scoped>
.mood-selector {
  @apply flex flex-col gap-6 items-center;
}

.mood-selector__header {
  @apply text-center;
}

.mood-selector__title {
  @apply text-2xl font-bold font-serif text-text-primary mb-1;
}

.mood-selector__subtitle {
  @apply text-base text-text-secondary;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
