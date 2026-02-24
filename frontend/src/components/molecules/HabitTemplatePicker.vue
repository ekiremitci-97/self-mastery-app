<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AppMoodIcon } from '@/components/atoms';
import { HABIT_CATEGORIES, type HabitTemplate } from '@/data/habitTemplates';

const emit = defineEmits<{
  select: [template: HabitTemplate];
  custom: [];
  cancel: [];
}>();

const { t } = useI18n();

const activeCategory = ref(HABIT_CATEGORIES[0].id);

const activeTemplates = computed(() =>
  HABIT_CATEGORIES.find(c => c.id === activeCategory.value)?.templates ?? [],
);
</script>

<template>
  <div class="template-picker">
    <button class="template-picker__close" @click="emit('cancel')">
      <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="template-picker__categories">
      <button
        v-for="cat in HABIT_CATEGORIES"
        :key="cat.id"
        :class="['cat-pill', { 'cat-pill--active': activeCategory === cat.id }]"
        @click="activeCategory = cat.id"
      >
        {{ t(cat.labelKey) }}
      </button>
    </div>

    <div class="template-picker__list">
      <button
        v-for="tmpl in activeTemplates"
        :key="tmpl.id"
        class="template-card"
        @click="emit('select', tmpl)"
      >
        <AppMoodIcon :mood="tmpl.icon" size="sm" />
        <div class="template-card__text">
          <span class="template-card__name">{{ t(tmpl.nameKey) }}</span>
          <span class="template-card__desc">{{ t(tmpl.descriptionKey) }}</span>
        </div>
      </button>
    </div>

    <div class="template-picker__footer">
      <button class="custom-pill" @click="emit('custom')">
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ t('habitTemplates.custom') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.template-picker {
  @apply relative flex flex-col gap-3 w-full;
}

.template-picker__close {
  @apply absolute top-0 right-0 w-6 h-6 rounded-lg flex items-center justify-center
         text-text-muted hover:text-accent hover:bg-card-hover
         transition-colors cursor-pointer;
}

.template-picker__categories {
  @apply flex items-center gap-1.5 overflow-x-auto;
}

.cat-pill {
  @apply px-3 py-1 text-[10px] font-medium rounded-pill border border-border
         bg-transparent text-text-muted transition-all cursor-pointer whitespace-nowrap;
}

.cat-pill--active {
  @apply text-white border-transparent;
  background-color: #C4A96A;
}

.cat-pill:not(.cat-pill--active):hover {
  @apply bg-card-hover;
}

.template-picker__list {
  @apply flex flex-col gap-2;
}

.template-card {
  @apply flex items-center gap-3 w-full px-4 py-2.5 bg-card border border-border rounded-2xl
         cursor-pointer hover:bg-card-hover transition-all text-left;
}

.template-card__text {
  @apply flex flex-col;
}

.template-card__name {
  @apply text-sm font-semibold text-text-primary;
}

.template-card__desc {
  @apply text-xs text-text-secondary;
}

.template-picker__footer {
  @apply flex justify-center;
}

.custom-pill {
  @apply pl-1.5 pr-4 py-1.5 text-xs text-accent border border-border rounded-pill
         bg-transparent hover:bg-card-hover transition-colors cursor-pointer
         inline-flex items-center gap-2;
}
</style>
