<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MoodSelector } from '@/components/organisms';
import type { QuadrantId } from '@self-mastery/shared';

const router = useRouter();

const handleSelect = (emotionId: string, quadrant: QuadrantId) => {
  router.push({
    name: 'quote',
    params: { mood: emotionId },
    query: { quadrant },
  });
};
</script>

<template>
  <div class="mood-select-view">
    <MoodSelector @select="handleSelect" />
  </div>
</template>

<style scoped>
.mood-select-view {
  @apply w-full;
}
</style>
