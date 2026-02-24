<script setup lang="ts">
import { computed } from 'vue';

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
});
</script>

<template>
  <p class="date-label">{{ formattedDate }}</p>
</template>

<style scoped>
.date-label {
  @apply text-sm text-accent font-light tracking-wide;
}
</style>
