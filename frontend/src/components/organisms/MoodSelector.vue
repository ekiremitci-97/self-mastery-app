<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { MoodCard } from '@/components/molecules';
import { AppMoodIcon } from '@/components/atoms';
import { MOOD_OPTIONS, type MoodType } from '@self-mastery/shared';
import { ref, nextTick } from 'vue';
import { useCustomMoods, type CustomMood } from '@/composables/useCustomMoods';

const emit = defineEmits<{
  select: [mood: MoodType];
  selectCustom: [label: string, description: string];
}>();

const { t } = useI18n();
const { customMoods, add, remove, update } = useCustomMoods();

const selectedMood = ref<MoodType | 'other' | string | null>(null);
const showOtherInput = ref(false);
const otherLabel = ref('');
const otherDesc = ref('');
const otherLabelInput = ref<HTMLInputElement | null>(null);
const editingMood = ref<CustomMood | null>(null);

const handleSelect = (mood: MoodType) => {
  selectedMood.value = mood;
  showOtherInput.value = false;
  editingMood.value = null;
  emit('select', mood);
};

const handleCustomSelect = (mood: CustomMood) => {
  selectedMood.value = `custom-${mood.id}`;
  showOtherInput.value = false;
  editingMood.value = null;
  emit('selectCustom', mood.label, mood.description);
};

const handleOtherClick = async () => {
  selectedMood.value = 'other';
  editingMood.value = null;
  showOtherInput.value = true;
  otherLabel.value = '';
  otherDesc.value = '';
  await nextTick();
  otherLabelInput.value?.focus();
};

const handleOtherSubmit = () => {
  const label = otherLabel.value.trim();
  const desc = otherDesc.value.trim();
  if (label) {
    if (editingMood.value) {
      update(editingMood.value.id, label, desc);
      editingMood.value = null;
    }
    showOtherInput.value = false;
    emit('selectCustom', label, desc);
  }
};

const handleSave = () => {
  const label = otherLabel.value.trim();
  const desc = otherDesc.value.trim();
  if (label) {
    if (editingMood.value) {
      update(editingMood.value.id, label, desc);
      editingMood.value = null;
    } else {
      add(label, desc);
    }
    showOtherInput.value = false;
    emit('selectCustom', label, desc);
  }
};

const handleEdit = async (mood: CustomMood) => {
  editingMood.value = mood;
  otherLabel.value = mood.label;
  otherDesc.value = mood.description;
  showOtherInput.value = true;
  selectedMood.value = 'other';
  await nextTick();
  otherLabelInput.value?.focus();
};

const handleDelete = (id: string) => {
  remove(id);
};
</script>

<template>
  <div class="mood-selector">
    <div class="mood-selector__header">
      <h1 class="mood-selector__title">{{ t('mood.title') }}</h1>
      <p class="mood-selector__subtitle">{{ t('mood.subtitle') }}</p>
    </div>

    <div class="mood-selector__list">
      <MoodCard
        v-for="option in MOOD_OPTIONS"
        :key="option.type"
        :option="option"
        :selected="selectedMood === option.type"
        @select="handleSelect(option.type)"
      />

      <!-- Saved custom moods -->
      <div
        v-for="cm in customMoods"
        :key="cm.id"
        :class="['custom-card', { 'custom-card--selected': selectedMood === `custom-${cm.id}` }]"
        @click="handleCustomSelect(cm)"
      >
        <AppMoodIcon :mood="cm.icon" size="md" />
        <div class="custom-card__text">
          <span class="custom-card__label">{{ cm.label }}</span>
          <span class="custom-card__desc">{{ cm.description }}</span>
        </div>
        <div class="custom-card__actions">
          <button class="custom-card__action" @click.stop="handleEdit(cm)">
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 5l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="custom-card__action custom-card__action--delete" @click.stop="handleDelete(cm.id)">
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Other: small pill or expanded input -->
    <div class="mood-selector__other">
      <button
        v-if="!showOtherInput"
        class="other-pill"
        @click="handleOtherClick"
      >
        <AppMoodIcon mood="other" size="sm" />
        {{ t('moods.other') }}
      </button>

      <div v-else class="other-input-box">
        <input
          ref="otherLabelInput"
          v-model="otherLabel"
          :placeholder="t('moods.otherLabelPlaceholder')"
          maxlength="20"
          class="other-input-box__field other-input-box__field--label"
          @keydown.enter="handleOtherSubmit"
        />
        <span class="other-input-box__sep" />
        <input
          v-model="otherDesc"
          :placeholder="t('moods.otherDescPlaceholder')"
          maxlength="60"
          class="other-input-box__field other-input-box__field--desc"
          @keydown.enter="handleOtherSubmit"
        />
        <div v-if="otherLabel.trim()" class="other-input-box__buttons">
          <button
            class="other-input-box__btn other-input-box__btn--save"
            @click="handleSave"
            :title="t('moods.saveAndGo')"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="other-input-box__btn other-input-box__btn--go"
            @click="handleOtherSubmit"
            :title="t('moods.justGo')"
          >
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mood-selector {
  @apply flex flex-col gap-5;
}

.mood-selector__header {
  @apply text-center;
}

.mood-selector__title {
  @apply text-2xl font-bold font-serif text-text-primary mb-1;
}

.mood-selector__subtitle {
  @apply text-base text-text-secondary;
}

.mood-selector__list {
  @apply flex flex-col gap-2.5;
}

.mood-selector__other {
  @apply flex justify-center;
}

/* Saved custom mood cards */
.custom-card {
  @apply flex items-center gap-3 w-full px-4 py-3 bg-card border border-border rounded-2xl
         cursor-pointer hover:bg-card-hover transition-all text-left;
}

.custom-card--selected {
  @apply border-text-secondary bg-card-hover;
}

.custom-card__text {
  @apply flex flex-col flex-1 min-w-0;
}

.custom-card__label {
  @apply text-sm font-semibold text-text-primary;
}

.custom-card__desc {
  @apply text-xs text-text-secondary;
}

.custom-card__actions {
  @apply flex items-center gap-1 shrink-0;
}

.custom-card__action {
  @apply w-7 h-7 rounded-lg flex items-center justify-center
         transition-colors cursor-pointer;
  color: #C4A96A;
}

.custom-card__action:hover {
  @apply bg-card-hover;
}

.custom-card__action--delete {
  color: #C4A96A;
}

.custom-card__action--delete:hover {
  color: #c97a7a;
}

/* Other pill */
.other-pill {
  @apply pl-1.5 pr-4 py-1.5 text-xs text-accent border border-border rounded-pill
         bg-transparent hover:bg-card-hover transition-colors cursor-pointer
         inline-flex items-center gap-2;
}

/* Input box */
.other-input-box {
  @apply relative flex flex-col gap-0 w-full px-4 py-3 border border-border rounded-2xl bg-card;
}

.other-input-box__field {
  @apply bg-transparent border-none outline-none w-full text-sm;
}

.other-input-box__field--label {
  @apply font-semibold text-text-primary placeholder-text-muted pb-2;
}

.other-input-box__field--desc {
  @apply text-text-secondary placeholder-text-muted pt-2 pr-16;
}

.other-input-box__sep {
  @apply h-px w-full bg-border;
}

.other-input-box__buttons {
  @apply absolute bottom-3 right-3 flex items-center gap-1.5;
}

.other-input-box__btn {
  @apply w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors;
}

.other-input-box__btn--save {
  @apply border;
  border-color: #C4A96A;
  color: #C4A96A;
}

.other-input-box__btn--save:hover {
  background-color: rgba(196, 169, 106, 0.1);
}

.other-input-box__btn--go {
  background-color: #C4A96A;
  color: white;
}

.other-input-box__btn--go:hover {
  background-color: #b89a5a;
}
</style>
