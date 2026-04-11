import { ref } from 'vue';
import { useHabits } from './useHabits';
import { useHabitStats } from './useHabitStats';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CHAT_KEY = 'self-mastery-guru-chat';
const MOOD_HISTORY_KEY = 'self-mastery-mood-history';

export interface GuruMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function loadMessages(): GuruMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: GuruMessage[]) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
}

function loadMoodHistory(): { mood: string; note: string | null; date: string }[] {
  try {
    const raw = localStorage.getItem(MOOD_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function buildUserData() {
  const { habits, completions } = useHabits();
  const { completionRate, currentStreak, perHabitStats } = useHabitStats();

  const moodHistory = loadMoodHistory().slice(0, 14);

  const savedQuotes = (() => {
    try {
      const raw = localStorage.getItem('self-mastery-saved-quotes');
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  })();

  return {
    moodHistory,
    habitStats: perHabitStats.value.map(h => ({
      name: h.name,
      completionRate: h.completionRate,
      currentStreak: h.currentStreak,
      bestStreak: h.bestStreak,
    })),
    overallStreak: currentStreak.value,
    overallCompletionRate: completionRate.value,
    savedQuotesCount: savedQuotes,
  };
}

const messages = ref<GuruMessage[]>(loadMessages());
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useGuru() {
  async function sendMessage(text: string) {
    const userMsg: GuruMessage = {
      id: Date.now().toString(36),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    messages.value.push(userMsg);
    saveMessages(messages.value);

    isLoading.value = true;
    error.value = null;

    try {
      const chatHistory = messages.value
        .filter(m => m.id !== userMsg.id)
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content }));

      const userData = buildUserData();

      const res = await fetch(`${API_URL}/api/guru/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          chatHistory,
          userData,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();

      const guruMsg: GuruMessage = {
        id: (Date.now() + 1).toString(36),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      messages.value.push(guruMsg);
      saveMessages(messages.value);
    } catch (e) {
      error.value = 'Could not reach the Guru. Please try again.';
      messages.value.pop();
      saveMessages(messages.value);
    } finally {
      isLoading.value = false;
    }
  }

  function clearChat() {
    messages.value = [];
    saveMessages(messages.value);
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
