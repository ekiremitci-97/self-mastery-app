<script setup lang="ts">
interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeKey: string;
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});

const emit = defineEmits<{
  select: [key: string];
}>();
</script>

<template>
  <div :class="['tab-pills', `tab-pills--${size}`]">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="['tab-pills__item', { 'tab-pills__item--active': activeKey === tab.key }]"
      @click="emit('select', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-pills {
  @apply flex items-center gap-2;
}

.tab-pills__item {
  @apply font-medium rounded-pill border border-border
         bg-transparent text-text-secondary transition-all cursor-pointer;
}

.tab-pills--md .tab-pills__item {
  @apply px-4 py-1.5 text-xs;
}

.tab-pills--sm .tab-pills__item {
  @apply px-3 py-1 text-[10px];
}

.tab-pills__item--active {
  @apply text-white border-transparent;
  background-color: #C4A96A;
}

.tab-pills__item:not(.tab-pills__item--active):hover {
  @apply bg-card-hover;
}
</style>
