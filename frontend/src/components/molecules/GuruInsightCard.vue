<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AppSpinner } from '@/components/atoms';

interface Props {
  insight: string | null;
  loading?: boolean;
  guruAvatar?: string;
  guruName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  guruAvatar: 'sage',
  guruName: 'Guru',
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const formattedInsight = computed(() => {
  if (!props.insight) return '';
  const escaped = escapeHtml(props.insight);
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
});

const emit = defineEmits<{
  talkToGuru: [];
}>();

const { t } = useI18n();
const expanded = ref(false);
</script>

<template>
  <div class="insight-card">
    <div class="insight-card__header">
      <div class="insight-card__icon">
        <img :src="`/avatars/${guruAvatar || 'sage'}.png`" alt="" class="insight-card__avatar" />
      </div>
      <span class="insight-card__label">{{ t('guru.dailyInsight') }}</span>
    </div>

    <div v-if="loading" class="insight-card__loading">
      <AppSpinner size="sm" />
    </div>

    <template v-else-if="insight">
      <p :class="['insight-card__text', { 'insight-card__text--clamped': !expanded }]" v-html="formattedInsight"></p>
      <button class="insight-card__toggle" @click="expanded = !expanded">
        {{ expanded ? t('guru.showLess') : t('guru.showMore') }}
      </button>
    </template>

    <button class="insight-card__cta" @click="emit('talkToGuru')">
      {{ t('guru.talkToGuru', { name: guruName }) }}
      <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.insight-card {
  @apply bg-card border border-border rounded-2xl p-4 flex flex-col gap-3;
}

.insight-card__header {
  @apply flex items-center gap-2;
}

.insight-card__icon {
  @apply w-7 h-7 rounded-full overflow-hidden flex-shrink-0;
}

.insight-card__avatar {
  @apply w-full h-full object-cover;
}

.insight-card__label {
  @apply text-xs font-semibold text-text-secondary uppercase tracking-wider;
}

.insight-card__loading {
  @apply flex items-center justify-center py-3;
}

.insight-card__text {
  @apply text-sm text-text-primary leading-relaxed;
}

.insight-card__text--clamped {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.insight-card__toggle {
  @apply text-xs font-medium text-accent hover:text-accent/80
         transition-colors cursor-pointer self-start;
}

.insight-card__cta {
  @apply flex items-center gap-1.5 text-xs font-medium text-accent
         hover:text-accent/80 transition-colors cursor-pointer self-start;
}
</style>
