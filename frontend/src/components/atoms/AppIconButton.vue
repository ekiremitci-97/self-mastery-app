<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md';
  variant?: 'default' | 'danger';
  label?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  label: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :class="[
      'icon-btn',
      `icon-btn--${size}`,
      `icon-btn--${variant}`,
    ]"
    :title="label"
    @click="emit('click', $event)"
  >
    <slot />
    <span v-if="label" class="icon-btn__tooltip">{{ label }}</span>
  </button>
</template>

<style scoped>
.icon-btn {
  @apply rounded-full flex items-center justify-center
         text-text-secondary hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer relative;
}

.icon-btn--sm {
  @apply w-8 h-8;
}

.icon-btn--md {
  @apply w-9 h-9;
}

.icon-btn--danger:hover {
  color: #E57373;
  @apply bg-card-hover;
}

.icon-btn__tooltip {
  @apply absolute top-1/2 px-2 py-1 text-[10px] font-medium
         whitespace-nowrap rounded-md pointer-events-none
         opacity-0 transition-opacity;
  right: calc(100% + 6px);
  transform: translateY(-50%);
  background-color: #2D2D2D;
  color: #FFFFFF;
}

.icon-btn:hover .icon-btn__tooltip {
  @apply opacity-100;
}
</style>
