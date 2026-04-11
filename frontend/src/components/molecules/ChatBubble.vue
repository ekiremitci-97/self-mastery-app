<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  guruAvatar?: string;
}

const props = defineProps<Props>();

const { t } = useI18n();

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const formattedContent = computed(() => {
  const escaped = escapeHtml(props.content);
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
});
</script>

<template>
  <div :class="['bubble', `bubble--${role}`]">
    <div v-if="role === 'assistant'" class="bubble__avatar">
      <img :src="`/avatars/${guruAvatar || 'sage'}.png`" alt="" class="bubble__avatar-img" />
    </div>
    <div :class="['bubble__content', `bubble__content--${role}`]">
      <p class="bubble__text" v-html="formattedContent"></p>
      <span class="bubble__time">{{ formatTime(timestamp) }}</span>
    </div>
  </div>
</template>

<style scoped>
.bubble {
  @apply flex gap-2 max-w-[85%];
}

.bubble--user {
  @apply ml-auto flex-row-reverse;
}

.bubble--assistant {
  @apply mr-auto;
}

.bubble__avatar {
  @apply w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1;
}

.bubble__avatar-img {
  @apply w-full h-full object-cover;
}

.bubble__content {
  @apply px-4 py-3 rounded-2xl;
}

.bubble__content--assistant {
  @apply bg-card border border-border rounded-tl-md;
}

.bubble__content--user {
  @apply bg-accent/15 border border-accent/20 rounded-tr-md;
}

.bubble__text {
  @apply text-sm text-text-primary leading-relaxed whitespace-pre-wrap;
}

.bubble__time {
  @apply block text-[10px] text-text-muted mt-1.5;
}

.bubble--user .bubble__time {
  @apply text-right;
}
</style>
