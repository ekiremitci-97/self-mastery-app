<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});
</script>

<template>
  <div :class="['breathe', `breathe--${size}`]" role="status">
    <div class="breathe__circle" />
    <span class="sr-only">Loading...</span>
  </div>
</template>

<style scoped>
.breathe {
  @apply flex items-center justify-center;
}

.breathe__circle {
  @apply rounded-full;
  background-color: rgba(196, 169, 106, 0.25);
  box-shadow: 0 0 16px rgba(196, 169, 106, 0.6), 0 0 32px rgba(196, 169, 106, 0.35), 0 0 48px rgba(196, 169, 106, 0.15);
  animation: breathe 3s ease-in-out infinite;
}

.breathe--sm .breathe__circle {
  @apply w-5 h-5;
}

.breathe--md .breathe__circle {
  @apply w-8 h-8;
}

.breathe--lg .breathe__circle {
  @apply w-12 h-12;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(0.7);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
