<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  activeTab: string;
}

defineProps<Props>();

const emit = defineEmits<{
  navigate: [tabName: string];
}>();

const { t } = useI18n();

const tabs = [
  { name: 'garden', labelKey: 'nav.garden' },
  { name: 'routine', labelKey: 'nav.routine' },
  { name: 'guide', labelKey: 'nav.guide' },
  { name: 'reflect', labelKey: 'nav.reflect' },
];
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      :class="['tab-bar__item', { 'tab-bar__item--active': activeTab === tab.name }]"
      @click="emit('navigate', tab.name)"
    >
      <!-- Garden: zen leaf/plant -->
      <svg v-if="tab.name === 'garden'" viewBox="0 0 24 24" fill="none" class="tab-bar__icon">
        <template v-if="activeTab === 'garden'">
          <path d="M12 22V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M5 12s0-7 7-7c0 0 0 7-7 7z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8s0 6-7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8s0-5-7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
        <template v-else>
          <path d="M12 22V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M5 12s0-7 7-7c0 0 0 7-7 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8s0 6-7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 8s0-5-7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
      </svg>

      <!-- Routine: calendar/grid -->
      <svg v-else-if="tab.name === 'routine'" viewBox="0 0 24 24" fill="none" class="tab-bar__icon">
        <template v-if="activeTab === 'routine'">
          <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="15" r="1" fill="currentColor"/>
          <circle cx="12" cy="15" r="1" fill="currentColor"/>
          <circle cx="16" cy="15" r="1" fill="currentColor"/>
        </template>
        <template v-else>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="8" cy="15" r="1" fill="currentColor"/>
          <circle cx="12" cy="15" r="1" fill="currentColor"/>
          <circle cx="16" cy="15" r="1" fill="currentColor"/>
        </template>
      </svg>

      <!-- Guide: compass star -->
      <svg v-else-if="tab.name === 'guide'" viewBox="0 0 24 24" fill="none" class="tab-bar__icon">
        <template v-if="activeTab === 'guide'">
          <path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.55 20 12 16.77 7.45 20l1.37-6.73L3.82 9l6.09-.74L12 2z" fill="currentColor" opacity="0.15"/>
          <path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.55 20 12 16.77 7.45 20l1.37-6.73L3.82 9l6.09-.74L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
        <template v-else>
          <path d="M12 2l2.09 6.26L20.18 9l-5 4.27L16.55 20 12 16.77 7.45 20l1.37-6.73L3.82 9l6.09-.74L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
      </svg>

      <!-- Reflect: open book/mirror -->
      <svg v-else-if="tab.name === 'reflect'" viewBox="0 0 24 24" fill="none" class="tab-bar__icon">
        <template v-if="activeTab === 'reflect'">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
        <template v-else>
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </template>
      </svg>

      <span class="tab-bar__label">{{ t(tab.labelKey) }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  @apply flex items-center justify-around w-full border-t border-border bg-background;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.tab-bar__item {
  @apply flex flex-col items-center gap-0.5 py-2 px-3 transition-colors cursor-pointer;
  color: #B5B5B5;
  min-width: 64px;
}

.tab-bar__item--active {
  color: #C4A96A;
}

.tab-bar__item:not(.tab-bar__item--active):hover {
  color: #8A8A8A;
}

.tab-bar__icon {
  @apply w-5 h-5;
}

.tab-bar__label {
  @apply text-[10px] font-medium tracking-wide;
}
</style>
