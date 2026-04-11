<script setup lang="ts">
interface Props {
  label: string;
  completedCount: number;
  totalCount: number;
  accentColor?: string;
}

withDefaults(defineProps<Props>(), {
  accentColor: '#C4A96A',
});
</script>

<template>
  <div class="section-header">
    <div class="section-header__bar" :style="{ backgroundColor: accentColor }" />
    <span class="section-header__label">{{ label }}</span>
    <span class="section-header__count" :style="{ color: accentColor }">
      {{ completedCount }}/{{ totalCount }}
    </span>
  </div>
</template>

<style scoped>
.section-header {
  @apply flex items-center gap-2 py-1.5;
}

.section-header__bar {
  @apply w-0.5 h-3.5 rounded-full;
}

.section-header__label {
  @apply text-[11px] font-medium text-text-muted font-mono uppercase tracking-wider flex-1;
}

.section-header__count {
  @apply text-[11px] font-mono font-medium;
}
</style>
