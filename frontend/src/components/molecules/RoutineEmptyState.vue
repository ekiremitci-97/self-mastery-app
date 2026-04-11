<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  message: string;
  showCta?: boolean;
}

withDefaults(defineProps<Props>(), {
  showCta: false,
});

const emit = defineEmits<{
  addHabit: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="empty-state">
    <p class="empty-state__text">{{ message }}</p>
    <button v-if="showCta" class="empty-state__cta" @click="emit('addHabit')">
      <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      {{ t('routine.addFirstHabit') }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  @apply flex flex-col items-center gap-2 py-3;
}

.empty-state__text {
  @apply text-xs text-text-muted text-center;
}

.empty-state__cta {
  @apply flex items-center gap-1.5 text-xs font-medium
         px-3 py-1.5 rounded-pill border border-border
         bg-transparent hover:bg-card-hover transition-colors cursor-pointer;
  color: #C4A96A;
}
</style>
