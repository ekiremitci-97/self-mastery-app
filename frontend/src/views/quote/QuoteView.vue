<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AppButton, AppBadge, AppSpinner, AppMoodIcon } from '@/components/atoms';
import { MOOD_OPTIONS, type MoodType } from '@self-mastery/shared';
import { getTimeOfDayKey } from '@/utils/greeting';

const STORAGE_KEY = 'self-mastery-saved-quotes';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const mood = computed(() => route.params.mood as string);
const isCustom = computed(() => mood.value === 'custom');
const customLabel = computed(() => (route.query.label as string) || '');
const customDescription = computed(() => (route.query.description as string) || '');
const moodOption = computed(() => MOOD_OPTIONS.find(m => m.type === mood.value));

const badgeLabel = computed(() => {
  if (isCustom.value) {
    return t('quote.feeling', { mood: customLabel.value.toLowerCase() });
  }
  if (moodOption.value) {
    return t('quote.feeling', { mood: t(moodOption.value.labelKey).toLowerCase() });
  }
  return '';
});

const badgeIconMood = computed(() => {
  if (isCustom.value) return 'other';
  return mood.value as MoodType;
});

const isSaved = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);
const quote = ref<{ text: string; author: string }>({ text: '', author: '' });

const fetchQuote = async () => {
  isLoading.value = true;
  error.value = null;

  const body: Record<string, string> = { mood: mood.value };
  if (isCustom.value) {
    body.customLabel = customLabel.value;
    body.customDescription = customDescription.value;
  }

  try {
    const response = await fetch(`${API_URL}/api/quotes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to generate quote');
    }

    const data = await response.json();
    quote.value = data;
    isSaved.value = false;
  } catch (e) {
    error.value = 'Could not load quote. Please try again.';
    console.error('Quote fetch error:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchQuote);

const handleSave = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const saved: Array<{ text: string; author: string; mood: string; date: string }> = raw ? JSON.parse(raw) : [];

  if (isSaved.value) {
    const idx = saved.findIndex(q => q.text === quote.value.text && q.author === quote.value.author);
    if (idx !== -1) saved.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    isSaved.value = false;
  } else {
    saved.push({
      text: quote.value.text,
      author: quote.value.author,
      mood: mood.value,
      date: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    isSaved.value = true;
  }
};

const handleAnother = async () => {
  isSaved.value = false;
  await fetchQuote();
};

const continueLabel = computed(() => {
  const key = getTimeOfDayKey();
  const map = { morning: 'continueMorning', afternoon: 'continueAfternoon', evening: 'continueEvening' };
  return t(`quote.${map[key]}`);
});

const handleContinue = () => {
  router.push('/habits');
};

const handleChangeMood = () => {
  router.push({ name: 'mood-select' });
};
</script>

<template>
  <div class="quote-view">
    <AppBadge v-if="badgeLabel">
      <template #icon>
        <AppMoodIcon :mood="badgeIconMood" size="sm" bare />
      </template>
      {{ badgeLabel }}
    </AppBadge>

    <div class="quote-view__divider" />

    <template v-if="isLoading">
      <AppSpinner size="lg" />
    </template>

    <template v-else-if="error">
      <p class="quote-view__error">{{ error }}</p>
      <AppButton variant="outline" size="sm" @click="fetchQuote">
        Try again
      </AppButton>
    </template>

    <template v-else>
      <blockquote class="quote-view__text">
        "{{ quote.text }}"
      </blockquote>

      <p class="quote-view__author">{{ quote.author }}</p>

      <div class="quote-view__inline-actions">
        <button class="quote-view__icon-btn" @click="handleSave">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :fill="isSaved ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span class="quote-view__icon-label">{{ isSaved ? t('quote.saved') : t('quote.save') }}</span>
        </button>

        <span class="quote-view__dot" />

        <button class="quote-view__icon-btn" @click="handleAnother">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
          </svg>
          <span class="quote-view__icon-label">{{ t('quote.another') }}</span>
        </button>
      </div>
    </template>

    <div v-if="!isLoading && !error" class="quote-view__bottom">
      <AppButton variant="dark" size="sm" @click="handleContinue">
        {{ continueLabel }}
        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 ml-1.5">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </AppButton>

      <button class="quote-view__change-mood" @click="handleChangeMood">
        {{ t('quote.changeMood') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.quote-view {
  @apply flex flex-col items-center gap-6 text-center;
}

.quote-view__divider {
  @apply w-12 h-px bg-border;
}

.quote-view__text {
  @apply text-2xl md:text-3xl font-bold font-serif text-text-primary leading-relaxed;
}

.quote-view__author {
  @apply text-base text-text-secondary italic;
}

.quote-view__error {
  @apply text-base text-text-secondary;
}

.quote-view__inline-actions {
  @apply flex items-center gap-4 mt-2;
}

.quote-view__icon-btn {
  @apply flex items-center gap-1.5 text-text-secondary hover:text-accent transition-colors cursor-pointer;
}

.quote-view__icon-label {
  @apply text-xs;
}

.quote-view__dot {
  @apply w-1 h-1 rounded-full bg-border;
}

.quote-view__bottom {
  @apply flex flex-col items-center gap-3 mt-4;
}

.quote-view__change-mood {
  @apply text-xs text-text-secondary hover:text-accent transition-colors cursor-pointer;
}
</style>
