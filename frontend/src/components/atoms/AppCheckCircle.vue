<script setup lang="ts">
interface Props {
  checked?: boolean;
}

withDefaults(defineProps<Props>(), {
  checked: false,
});

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <button
    :class="['check-circle', { 'check-circle--checked': checked }]"
    @click.stop="emit('toggle')"
  >
    <svg v-if="checked" viewBox="0 0 24 24" fill="none" class="check-circle__icon">
      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<style scoped>
.check-circle {
  @apply w-7 h-7 rounded-full border-2 flex items-center justify-center
         shrink-0 transition-all cursor-pointer;
  border-color: #D5D0C6;
}

.check-circle:hover {
  border-color: #C4A96A;
}

.check-circle--checked {
  border-color: #C4A96A;
  background-color: #C4A96A;
  color: white;
}

.check-circle__icon {
  @apply w-3.5 h-3.5;
}
</style>
