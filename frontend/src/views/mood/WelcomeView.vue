<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AppButton } from '@/components/atoms';
import { getTimeOfDayKey } from '@/utils/greeting';

const VISITED_KEY = 'self-mastery-has-visited';

const router = useRouter();
const { t } = useI18n();
const timeOfDayKey = getTimeOfDayKey();

onMounted(() => {
  if (localStorage.getItem(VISITED_KEY)) {
    router.replace({ name: 'mood-select' });
  }
});

const handleBegin = () => {
  localStorage.setItem(VISITED_KEY, '1');
  router.push({ name: 'mood-select' });
};
</script>

<template>
  <div class="welcome-view">
    <div class="welcome-view__content">
      <p class="welcome-view__tagline">{{ t('app.tagline') }}</p>
      <h1 class="welcome-view__greeting">{{ t(`greeting.${timeOfDayKey}`) }}</h1>
      <p class="welcome-view__breathe">{{ t('welcome.breathe') }}</p>
      <p class="welcome-view__subtitle">{{ t('welcome.subtitle') }}</p>
    </div>

    <AppButton size="lg" @click="handleBegin">
      {{ t('welcome.begin') }}
    </AppButton>
  </div>
</template>

<style scoped>
.welcome-view {
  @apply flex flex-col items-center gap-10 text-center;
}

.welcome-view__content {
  @apply flex flex-col items-center gap-1;
}

.welcome-view__tagline {
  @apply text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4;
}

.welcome-view__greeting {
  @apply text-4xl md:text-5xl font-bold font-serif text-text-primary mb-3;
}

.welcome-view__breathe {
  @apply text-base text-text-secondary;
}

.welcome-view__subtitle {
  @apply text-base text-text-secondary;
}
</style>
