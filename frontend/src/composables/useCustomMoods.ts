import { ref } from 'vue';
import { matchEmotionIcon } from '@/utils/emotionIcon';
import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';

export interface CustomMood {
  id: string;
  label: string;
  description: string;
  icon: MoodIconType;
}

const STORAGE_KEY = 'self-mastery-custom-moods';

function loadFromStorage(): CustomMood[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return parsed.map((m: CustomMood) => ({
      ...m,
      icon: m.icon || matchEmotionIcon(m.label),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(moods: CustomMood[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
}

const customMoods = ref<CustomMood[]>(loadFromStorage());

export function useCustomMoods() {
  function add(label: string, description: string): CustomMood {
    const mood: CustomMood = {
      id: Date.now().toString(36),
      label: label.trim(),
      description: description.trim(),
      icon: matchEmotionIcon(label),
    };
    customMoods.value.push(mood);
    saveToStorage(customMoods.value);
    return mood;
  }

  function remove(id: string) {
    customMoods.value = customMoods.value.filter(m => m.id !== id);
    saveToStorage(customMoods.value);
  }

  function update(id: string, label: string, description: string) {
    const mood = customMoods.value.find(m => m.id === id);
    if (mood) {
      mood.label = label.trim();
      mood.description = description.trim();
      mood.icon = matchEmotionIcon(label);
      saveToStorage(customMoods.value);
    }
  }

  return { customMoods, add, remove, update };
}
