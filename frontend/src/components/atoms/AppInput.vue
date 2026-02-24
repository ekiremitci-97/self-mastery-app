<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    class="input"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.input {
  @apply w-full h-11 px-4 bg-card border border-border rounded-xl
         text-text-primary placeholder:text-text-muted
         focus:outline-none focus:border-text-secondary
         disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
