<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AppHeartButton, AppDateLabel } from '@/components/atoms';
import { getTimeOfDayKey } from '@/utils/greeting';

const { t } = useI18n();

const timeOfDay = getTimeOfDayKey();

const blobColors = computed(() => {
  const palettes = {
    morning: { primary: '#C4A96A', secondary: '#D4B896' },
    afternoon: { primary: '#C4A96A', secondary: '#A9B8A0' },
    evening: { primary: '#C4A96A', secondary: '#B8A9C4' },
  };
  return palettes[timeOfDay];
});
const showEmptyMsg = ref(false);
let hideTimer: ReturnType<typeof setTimeout>;

const handleHeartClick = () => {
  const raw = localStorage.getItem('self-mastery-saved-quotes');
  const saved = raw ? JSON.parse(raw) : [];

  if (saved.length === 0) {
    showEmptyMsg.value = true;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      showEmptyMsg.value = false;
    }, 2500);
  }
};
</script>

<template>
  <div class="main-layout">
    <div
      class="ambient-blob ambient-blob--primary"
      :style="{ background: `radial-gradient(circle, ${blobColors.primary} 0%, transparent 70%)` }"
    />
    <div
      class="ambient-blob ambient-blob--secondary"
      :style="{ background: `radial-gradient(circle, ${blobColors.secondary} 0%, transparent 70%)` }"
    />
    <div class="main-layout__heart">
      <AppHeartButton @click="handleHeartClick" />
      <Transition name="toast">
        <p v-if="showEmptyMsg" class="heart-toast">
          {{ t('savedQuotes.empty') }}
        </p>
      </Transition>
    </div>

    <main class="main-layout__content">
      <div class="main-layout__inner">
        <slot />
      </div>
    </main>

    <footer class="main-layout__footer">
      <AppDateLabel />
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  @apply h-screen flex flex-col items-center justify-between px-6 py-8 relative overflow-hidden;
}

.ambient-blob {
  @apply absolute pointer-events-none;
  width: 70vw;
  height: 70vw;
  min-width: 400px;
  min-height: 400px;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}

.ambient-blob--primary {
  top: -20%;
  right: -25%;
  opacity: 0.25;
}

.ambient-blob--secondary {
  bottom: -20%;
  left: -25%;
  opacity: 0.18;
}

.main-layout__heart {
  @apply absolute top-6 right-6 z-10;
}

.main-layout__content {
  @apply w-full max-w-md flex flex-col items-center flex-1 z-10 overflow-y-auto;
  scrollbar-width: none;
}

.main-layout__content::-webkit-scrollbar {
  display: none;
}

.main-layout__inner {
  @apply w-full flex flex-col items-center;
  margin-top: auto;
  margin-bottom: auto;
}

.main-layout__footer {
  @apply pt-6 pb-2 z-10;
}

.heart-toast {
  @apply absolute right-0 top-12 mt-1 whitespace-nowrap text-xs text-text-secondary
         bg-card border border-border rounded-xl px-3 py-2 shadow-sm;
}

.toast-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
