<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ChatBubble, GuruSetup } from '@/components/molecules';
import { AppIconButton } from '@/components/atoms';
import { useGuru } from '@/composables/useGuru';
import { useGuruProfile } from '@/composables/useGuruProfile';
import { useSpeechRecognition } from '@/composables/useSpeechRecognition';
import { useGuruVoice } from '@/composables/useGuruVoice';

const router = useRouter();
const { t } = useI18n();
const { messages, isLoading, error, sendMessage, clearChat } = useGuru();
const { isSetUp, setUp, getAvatarId, getAvatarSrc, getName, avatarOptions } = useGuruProfile();
const { isRecording, transcript, isSupported: micSupported, toggle: toggleMic } = useSpeechRecognition();
const { isSpeaking, isLoadingAudio, audioLevel, speak, stop: stopSpeaking } = useGuruVoice();

const inputText = ref('');
const messageListRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const canSend = computed(() => inputText.value.trim().length > 0 && !isLoading.value);

// Animated avatar ring style driven by audio level
const avatarRingStyle = computed(() => {
  if (!isSpeaking.value && !isLoadingAudio.value) return {};
  if (isLoadingAudio.value) {
    return { '--ring-scale': '1', '--glow-spread': '8px', '--glow-opacity': '0.25' };
  }
  const level = audioLevel.value;
  return {
    '--ring-scale': String(1 + level * 0.15),
    '--glow-spread': `${8 + level * 20}px`,
    '--glow-opacity': String(0.2 + level * 0.5),
  };
});

function handleBack() {
  router.push({ name: 'routine' });
}

function handleClear() {
  clearChat();
  stopSpeaking();
}

function handleSetupComplete(name: string, avatar: string) {
  setUp(name, avatar);
  nextTick(() => {
    inputRef.value?.focus();
  });
}

async function handleSend() {
  const text = inputText.value.trim();
  if (!text || isLoading.value) return;
  inputText.value = '';
  stopSpeaking();
  await sendMessage(text);
}

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
  });
}

// Fill input from speech transcript
watch(transcript, (val) => {
  if (val) inputText.value = val;
});

// Auto-play TTS when new assistant message arrives
watch(() => messages.value.length, (newLen, oldLen) => {
  scrollToBottom();
  if (newLen > oldLen) {
    const lastMsg = messages.value[messages.value.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      speak(lastMsg.content);
    }
  }
});

watch(isLoading, scrollToBottom);

onMounted(() => {
  scrollToBottom();
  if (isSetUp.value) {
    inputRef.value?.focus();
  }
});
</script>

<template>
  <div class="guru-chat">
    <!-- Setup screen on first visit -->
    <template v-if="!isSetUp">
      <div class="guru-chat__top-row">
        <AppIconButton @click="handleBack">
          <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </AppIconButton>
      </div>
      <div class="guru-chat__setup-wrap">
        <GuruSetup
          :avatar-options="avatarOptions"
          @complete="handleSetupComplete"
        />
      </div>
    </template>

    <!-- Chat interface after setup -->
    <template v-else>
      <!-- Top action row -->
      <div class="guru-chat__top-row">
        <AppIconButton @click="handleBack">
          <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </AppIconButton>
        <AppIconButton
          v-if="messages.length > 0"
          variant="danger"
          @click="handleClear"
        >
          <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
            <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </AppIconButton>
      </div>

      <!-- Prominent centered avatar with animated ring -->
      <div class="guru-chat__hero">
        <div
          :class="[
            'guru-chat__hero-ring',
            { 'guru-chat__hero-ring--speaking': isSpeaking, 'guru-chat__hero-ring--loading': isLoadingAudio }
          ]"
          :style="avatarRingStyle"
        >
          <div class="guru-chat__hero-gradient" />
          <div class="guru-chat__hero-avatar">
            <img :src="getAvatarSrc()" alt="" class="guru-chat__hero-img" />
          </div>
        </div>
        <span class="guru-chat__hero-name">{{ getName() }}</span>
        <p v-if="isRecording" class="guru-chat__hero-status guru-chat__hero-status--recording">
          {{ t('guru.recording') }}
        </p>
        <p v-else-if="messages.length === 0" class="guru-chat__hero-greeting">
          {{ t('guru.greetingNamed', { name: getName() }) }}
        </p>
      </div>

      <!-- Messages -->
      <div ref="messageListRef" class="guru-chat__messages">
        <ChatBubble
          v-for="msg in messages"
          :key="msg.id"
          :content="msg.content"
          :role="msg.role"
          :timestamp="msg.timestamp"
          :guru-avatar="getAvatarId()"
        />

        <div v-if="isLoading" class="guru-chat__thinking">
          <div class="guru-chat__thinking-avatar">
            <img :src="getAvatarSrc()" alt="" class="guru-chat__thinking-img" />
          </div>
          <div class="guru-chat__thinking-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>

      <p v-if="error" class="guru-chat__error">{{ error }}</p>

      <!-- Glass bottom bar -->
      <div class="guru-chat__glass-bar">
        <div class="guru-chat__input-row">
          <!-- Mic button -->
          <button
            v-if="micSupported"
            :class="['guru-chat__mic', { 'guru-chat__mic--active': isRecording }]"
            @click="toggleMic()"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 19v4M8 23h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <input
            ref="inputRef"
            v-model="inputText"
            :placeholder="t('guru.placeholder')"
            :disabled="isLoading"
            class="guru-chat__input"
            @keydown.enter="handleSend"
          />

          <button
            :class="['guru-chat__send', { 'guru-chat__send--active': canSend }]"
            :disabled="!canSend"
            @click="handleSend"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.guru-chat {
  @apply flex flex-col w-full;
  flex: 1;
  min-height: 0;
}

.guru-chat__setup-wrap {
  @apply flex-1 flex items-center justify-center;
}

/* Top action row */
.guru-chat__top-row {
  @apply flex items-center justify-between py-2;
}

/* Hero avatar area */
.guru-chat__hero {
  @apply flex flex-col items-center gap-1.5 py-3;
}

.guru-chat__hero-ring {
  @apply rounded-full relative;
  padding: 4px;
  background: linear-gradient(135deg, rgba(196, 169, 106, 0.2), rgba(196, 169, 106, 0.05));
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.guru-chat__hero-ring--speaking {
  transform: scale(var(--ring-scale, 1));
  box-shadow:
    0 0 var(--glow-spread, 8px) rgba(196, 169, 106, var(--glow-opacity, 0.2)),
    0 0 calc(var(--glow-spread, 8px) * 2) rgba(212, 184, 150, calc(var(--glow-opacity, 0.2) * 0.5));
}

.guru-chat__hero-ring--loading {
  animation: avatar-breathe 2s ease-in-out infinite;
}

/* Rotating gradient ring (visible when speaking) */
.guru-chat__hero-gradient {
  @apply absolute inset-0 rounded-full opacity-0;
  background: conic-gradient(
    from 0deg,
    #C4A96A,
    #D4B896,
    #E8D5B0,
    #B89A5A,
    #C4A96A
  );
  transition: opacity 0.3s ease;
  z-index: 0;
}

.guru-chat__hero-ring--speaking .guru-chat__hero-gradient {
  opacity: 1;
  animation: ring-rotate 3s linear infinite;
}

.guru-chat__hero-avatar {
  @apply w-20 h-20 rounded-full overflow-hidden relative;
  z-index: 1;
  box-shadow: 0 0 16px rgba(196, 169, 106, 0.3), 0 0 32px rgba(196, 169, 106, 0.1);
}

.guru-chat__hero-img {
  @apply w-full h-full object-cover;
}

.guru-chat__hero-name {
  @apply text-base font-semibold text-text-primary;
}

.guru-chat__hero-greeting {
  @apply text-xs text-text-secondary text-center max-w-[240px] leading-relaxed;
}

.guru-chat__hero-status {
  @apply text-xs text-text-secondary;
}

.guru-chat__hero-status--recording {
  color: #E57373;
  animation: recording-pulse 1.5s ease-in-out infinite;
}

@keyframes avatar-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes recording-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Messages */
.guru-chat__messages {
  @apply flex-1 overflow-y-auto flex flex-col gap-3 py-3 pr-1;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
}

.guru-chat__thinking {
  @apply flex items-center gap-2 mr-auto;
}

.guru-chat__thinking-avatar {
  @apply w-7 h-7 rounded-full overflow-hidden flex-shrink-0;
}

.guru-chat__thinking-img {
  @apply w-full h-full object-cover;
}

.guru-chat__thinking-dots {
  @apply flex gap-1 px-4 py-3 bg-card border border-border rounded-2xl rounded-tl-md;
}

.guru-chat__thinking-dots span {
  @apply w-1.5 h-1.5 rounded-full bg-text-muted;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.guru-chat__thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.guru-chat__thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

.guru-chat__error {
  @apply text-xs text-center py-2;
  color: #E57373;
}

/* Glass bottom bar */
.guru-chat__glass-bar {
  @apply pt-3;
  background: rgba(248, 247, 244, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(229, 226, 220, 0.5);
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
}

.guru-chat__input-row {
  @apply flex items-center gap-2;
}

/* Mic button */
.guru-chat__mic {
  @apply w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
         text-text-muted transition-all cursor-pointer;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(229, 226, 220, 0.5);
}

.guru-chat__mic--active {
  background-color: #E57373;
  @apply border-transparent text-white;
  animation: mic-pulse 1.5s ease-in-out infinite;
}

@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(229, 115, 115, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(229, 115, 115, 0); }
}

.guru-chat__input {
  @apply flex-1 h-11 px-5 rounded-full
         text-sm text-text-primary placeholder:text-text-muted
         focus:outline-none disabled:opacity-50;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(229, 226, 220, 0.5);
}

.guru-chat__input:focus {
  border-color: rgba(196, 169, 106, 0.4);
}

.guru-chat__send {
  @apply w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
         text-text-muted transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(229, 226, 220, 0.5);
}

.guru-chat__send--active {
  background-color: #C4A96A;
  @apply border-transparent text-white;
}

.guru-chat__send--active:hover {
  background-color: #b89a5a;
}
</style>
