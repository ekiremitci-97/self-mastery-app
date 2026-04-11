<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface AvatarOption {
  readonly id: string;
  readonly label: string;
}

interface Props {
  avatarOptions: readonly AvatarOption[];
}

defineProps<Props>();

const emit = defineEmits<{
  complete: [name: string, avatar: string];
}>();

const { t } = useI18n();
const name = ref('');
const selectedAvatar = ref('sage');
</script>

<template>
  <div class="guru-setup">
    <div class="guru-setup__header">
      <h2 class="guru-setup__title">{{ t('guru.setupTitle') }}</h2>
      <p class="guru-setup__subtitle">{{ t('guru.setupSubtitle') }}</p>
    </div>

    <div class="guru-setup__avatars">
      <button
        v-for="avatar in avatarOptions"
        :key="avatar.id"
        :class="['avatar-circle', { 'avatar-circle--selected': selectedAvatar === avatar.id }]"
        @click="selectedAvatar = avatar.id"
      >
        <img :src="`/avatars/${avatar.id}.png`" :alt="avatar.label" class="avatar-circle__img" />
      </button>
    </div>

    <input
      v-model="name"
      :placeholder="t('guru.namePlaceholder')"
      maxlength="20"
      class="guru-setup__input"
      @keydown.enter="name.trim() && emit('complete', name, selectedAvatar)"
    />

    <button
      :class="['guru-setup__start', { 'guru-setup__start--active': name.trim().length > 0 }]"
      :disabled="!name.trim()"
      @click="emit('complete', name, selectedAvatar)"
    >
      {{ t('guru.startChat') }}
    </button>
  </div>
</template>

<style scoped>
.guru-setup {
  @apply flex flex-col items-center gap-6 py-8 px-4;
}

.guru-setup__header {
  @apply text-center;
}

.guru-setup__title {
  @apply text-xl font-bold font-serif text-text-primary mb-1;
}

.guru-setup__subtitle {
  @apply text-sm text-text-secondary;
}

.guru-setup__avatars {
  @apply flex items-center justify-center gap-3 flex-wrap;
}

.avatar-circle {
  @apply w-16 h-16 rounded-full overflow-hidden p-0
         cursor-pointer transition-all border-2 border-transparent;
}

.avatar-circle:hover {
  border-color: rgba(196, 169, 106, 0.4);
}

.avatar-circle--selected {
  border-color: #C4A96A;
  box-shadow: 0 0 12px rgba(196, 169, 106, 0.4), 0 0 24px rgba(196, 169, 106, 0.15);
}

.avatar-circle__img {
  @apply w-full h-full object-cover;
}

.guru-setup__input {
  @apply w-full max-w-[260px] h-11 px-4 bg-card border border-border rounded-xl
         text-sm text-text-primary text-center placeholder:text-text-muted
         focus:outline-none focus:border-text-secondary;
}

.guru-setup__start {
  @apply h-11 px-8 text-sm font-medium rounded-pill
         bg-card border border-border text-text-muted
         transition-all cursor-pointer;
}

.guru-setup__start--active {
  @apply text-white border-transparent;
  background-color: #C4A96A;
}

.guru-setup__start--active:hover {
  background-color: #b89a5a;
}

.guru-setup__start:disabled {
  @apply opacity-40 cursor-not-allowed;
}
</style>
