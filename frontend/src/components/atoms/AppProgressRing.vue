<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 44,
  strokeWidth: 3,
});

const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const offset = computed(() => circumference.value * (1 - props.progress));
</script>

<template>
  <svg
    :width="size"
    :height="size"
    class="progress-ring"
  >
    <circle
      class="progress-ring__bg"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      fill="none"
    />
    <circle
      class="progress-ring__fill"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      fill="none"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
      transform="rotate(-90)"
      :transform-origin="`${size / 2} ${size / 2}`"
    />
  </svg>
</template>

<style scoped>
.progress-ring__bg {
  stroke: #E8E4DC;
}

.progress-ring__fill {
  stroke: #C4A96A;
  transition: stroke-dashoffset 0.4s ease;
}
</style>
