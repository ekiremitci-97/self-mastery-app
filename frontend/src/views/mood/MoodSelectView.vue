<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MoodSelector } from '@/components/organisms';
import type { MoodType } from '@self-mastery/shared';

const router = useRouter();

const handleMoodSelect = (mood: MoodType) => {
  router.push({ name: 'quote', params: { mood } });
};

const handleCustomMood = (label: string, description: string) => {
  router.push({
    name: 'quote',
    params: { mood: 'custom' },
    query: { label, description },
  });
};
</script>

<template>
  <div class="mood-select-view">
    <MoodSelector @select="handleMoodSelect" @select-custom="handleCustomMood" />
  </div>
</template>

<style scoped>
.mood-select-view {
  @apply w-full;
}
</style>
