<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AppCard, AppMoodIcon, AppButton } from '@/components/atoms';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';

const STORAGE_KEY = 'self-mastery-saved-quotes';

const router = useRouter();
const { t } = useI18n();

interface SavedQuote {
  text: string;
  author: string;
  mood: string;
  date: string;
}

const savedQuotes = ref<SavedQuote[]>([]);

function loadQuotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  savedQuotes.value = raw ? JSON.parse(raw) : [];
}

loadQuotes();

const sortedQuotes = computed(() =>
  [...savedQuotes.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
);

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function handleRemove(quote: SavedQuote) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const all: SavedQuote[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex(q => q.text === quote.text && q.author === quote.author);
  if (idx !== -1) all.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  savedQuotes.value = all;
}

function handleStats() {
  router.push({ name: 'stats' });
}
</script>

<template>
  <div class="journey-view">
    <div class="journey-view__header">
      <h1 class="journey-view__title">{{ t('reflect.title') }}</h1>
      <button class="journey-view__stats-btn" @click="handleStats">
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
          <path d="M3 20h18M5 17l4-5 4 3 6-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ t('reflect.viewStats') }}
      </button>
    </div>

    <div v-if="sortedQuotes.length > 0" class="journey-view__quotes">
      <h2 class="journey-view__section-title">{{ t('reflect.savedQuotes') }}</h2>
      <AppCard
        v-for="(quote, idx) in sortedQuotes"
        :key="idx"
        class="journey-view__quote-card"
      >
        <div class="journey-view__quote-top">
          <AppMoodIcon :mood="(quote.mood === 'custom' ? 'other' : quote.mood) as MoodIconType" size="sm" bare />
          <span class="journey-view__quote-date">{{ formatDate(quote.date) }}</span>
          <button class="journey-view__remove" @click="handleRemove(quote)">
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <blockquote class="journey-view__quote-text">"{{ quote.text }}"</blockquote>
        <span class="journey-view__quote-author">{{ quote.author }}</span>
      </AppCard>
    </div>

    <div v-else class="journey-view__empty">
      <div class="journey-view__empty-icon">
        <svg viewBox="0 0 24 24" fill="none" class="w-10 h-10">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="journey-view__empty-title">{{ t('reflect.emptyTitle') }}</p>
      <p class="journey-view__empty-subtitle">{{ t('reflect.emptySubtitle') }}</p>
      <AppButton variant="outline" size="sm" @click="router.push({ name: 'garden' })">
        {{ t('reflect.startCheckin') }}
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.journey-view {
  @apply w-full flex flex-col gap-3 flex-1;
  min-height: 0;
}

.journey-view__header {
  @apply flex items-center justify-between;
}

.journey-view__title {
  @apply text-2xl font-bold font-serif text-text-primary;
}

.journey-view__stats-btn {
  @apply flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
         rounded-pill border border-border text-text-secondary
         hover:text-accent hover:border-accent transition-colors cursor-pointer;
}

.journey-view__section-title {
  @apply text-xs font-semibold text-text-muted uppercase tracking-wider;
}

.journey-view__quotes {
  @apply flex flex-col gap-3;
}

.journey-view__quote-card {
  @apply p-4 flex flex-col gap-2;
}

.journey-view__quote-top {
  @apply flex items-center gap-2;
}

.journey-view__quote-date {
  @apply flex-1 text-xs text-text-muted;
}

.journey-view__remove {
  @apply w-6 h-6 rounded-lg flex items-center justify-center
         text-text-muted hover:text-red-400 transition-colors cursor-pointer;
}

.journey-view__quote-text {
  @apply text-base font-serif text-text-primary leading-relaxed;
}

.journey-view__quote-author {
  @apply text-sm text-text-secondary italic;
}

.journey-view__empty {
  @apply flex flex-col items-center gap-3 py-16 text-center;
}

.journey-view__empty-icon {
  @apply text-text-muted mb-2;
}

.journey-view__empty-title {
  @apply text-lg font-serif font-semibold text-text-primary;
}

.journey-view__empty-subtitle {
  @apply text-sm text-text-muted max-w-[240px];
}
</style>
