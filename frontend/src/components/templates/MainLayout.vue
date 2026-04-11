<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppDateLabel } from '@/components/atoms';
import { AppTabBar } from '@/components/molecules';
import { getTimeOfDayKey } from '@/utils/greeting';

const route = useRoute();
const router = useRouter();

const timeOfDay = getTimeOfDayKey();

const blobColors = computed(() => {
  const palettes = {
    morning: { primary: '#C4A96A', secondary: '#D4B896' },
    afternoon: { primary: '#C4A96A', secondary: '#A9B8A0' },
    evening: { primary: '#C4A96A', secondary: '#B8A9C4' },
  };
  return palettes[timeOfDay];
});

const showTabBar = computed(() => route.meta.showTabBar === true);
const centerContent = computed(() => !showTabBar.value);

const activeTab = computed(() => route.name as string);

function handleNavigate(tabName: string) {
  if (tabName !== route.name) {
    router.push({ name: tabName });
  }
}
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

    <main class="main-layout__content">
      <div :class="['main-layout__inner', { 'main-layout__inner--center': centerContent }]">
        <slot />
      </div>
    </main>

    <footer v-if="showTabBar" class="main-layout__footer">
      <AppTabBar
        :active-tab="activeTab"
        @navigate="handleNavigate"
      />
    </footer>

    <footer v-else class="main-layout__footer-minimal">
      <AppDateLabel />
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  @apply h-screen flex flex-col items-center px-5 pt-4 relative overflow-hidden;
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

.main-layout__content {
  @apply w-full max-w-md flex flex-col items-center flex-1 z-10 overflow-y-auto;
  scrollbar-width: none;
}

.main-layout__content::-webkit-scrollbar {
  display: none;
}

.main-layout__inner {
  @apply w-full flex flex-col flex-1 py-2;
  min-height: 0;
}

.main-layout__inner--center {
  @apply items-center flex-initial;
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 0;
  padding-bottom: 0;
}

.main-layout__footer {
  @apply w-full max-w-md flex flex-col items-center z-10;
}

.main-layout__footer-minimal {
  @apply pt-6 pb-2 z-10;
}
</style>
