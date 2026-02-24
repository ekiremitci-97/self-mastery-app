<script setup lang="ts">
interface Props {
  variant?: 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'dark',
  size: 'md',
  disabled: false,
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--full-width': fullWidth },
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center font-medium rounded-pill transition-all cursor-pointer;
}

.btn--dark {
  @apply bg-btn-dark text-white hover:bg-btn-dark-hover;
}

.btn--outline {
  @apply bg-transparent text-text-primary border border-border hover:bg-card-hover;
}

.btn--ghost {
  @apply bg-transparent text-text-secondary hover:text-text-primary;
}

.btn--sm {
  @apply h-10 px-5 text-sm;
}

.btn--md {
  @apply h-12 px-8 text-base;
}

.btn--lg {
  @apply h-14 px-10 text-lg;
}

.btn--full-width {
  @apply w-full;
}

.btn:disabled {
  @apply opacity-40 cursor-not-allowed;
}
</style>
