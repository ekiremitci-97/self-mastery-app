<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  data: { label: string; value: number }[];
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 120,
});

const padding = { top: 8, bottom: 18, left: 4, right: 4 };
const barGap = 3;

const svgWidth = computed(() => {
  const count = props.data.length;
  if (count === 0) return 200;
  const barWidth = Math.max(6, Math.min(20, 300 / count));
  return padding.left + padding.right + count * (barWidth + barGap) - barGap;
});

const barWidth = computed(() => {
  const count = props.data.length;
  if (count === 0) return 12;
  return Math.max(6, Math.min(20, 300 / count));
});

const chartHeight = computed(() => props.height - padding.top - padding.bottom);

const guides = [0.25, 0.5, 0.75];

function barX(index: number): number {
  return padding.left + index * (barWidth.value + barGap);
}

function barHeight(value: number): number {
  return Math.max(2, value * chartHeight.value);
}

function barY(value: number): number {
  return padding.top + chartHeight.value - barHeight(value);
}
</script>

<template>
  <svg
    :viewBox="`0 0 ${svgWidth} ${height}`"
    class="bar-chart"
    :style="{ height: `${height}px` }"
    preserveAspectRatio="xMidYEnd meet"
  >
    <!-- Guide lines -->
    <line
      v-for="g in guides"
      :key="g"
      :x1="padding.left"
      :x2="svgWidth - padding.right"
      :y1="padding.top + chartHeight * (1 - g)"
      :y2="padding.top + chartHeight * (1 - g)"
      class="bar-chart__guide"
    />

    <!-- Bars -->
    <rect
      v-for="(bar, i) in data"
      :key="i"
      :x="barX(i)"
      :y="barY(bar.value)"
      :width="barWidth"
      :height="barHeight(bar.value)"
      rx="3"
      class="bar-chart__bar"
    />

    <!-- Labels -->
    <text
      v-for="(bar, i) in data"
      :key="'l-' + i"
      :x="barX(i) + barWidth / 2"
      :y="height - 2"
      class="bar-chart__label"
    >
      {{ bar.label }}
    </text>
  </svg>
</template>

<style scoped>
.bar-chart {
  width: 100%;
  display: block;
}

.bar-chart__guide {
  stroke: #E5E2DC;
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}

.bar-chart__bar {
  fill: #C4A96A;
  transition: height 0.4s ease, y 0.4s ease;
}

.bar-chart__label {
  fill: #B5B5B5;
  font-size: 7px;
  font-family: 'Inter', sans-serif;
  text-anchor: middle;
}
</style>
