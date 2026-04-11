import { ref, onMounted } from 'vue';
import { useHabits } from './useHabits';
import { useHabitStats } from './useHabitStats';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const INSIGHT_KEY = 'self-mastery-guru-insight';
const MOOD_HISTORY_KEY = 'self-mastery-mood-history';

interface CachedInsight {
  insight: string;
  date: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadCached(): CachedInsight | null {
  try {
    const raw = localStorage.getItem(INSIGHT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedInsight;
    if (parsed.date !== todayKey()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveInsight(data: CachedInsight) {
  localStorage.setItem(INSIGHT_KEY, JSON.stringify(data));
}

function loadMoodHistory(): { mood: string; note: string | null; date: string }[] {
  try {
    const raw = localStorage.getItem(MOOD_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const insight = ref<string | null>(null);
const isLoading = ref(false);

export function useGuruInsight() {
  function buildUserData() {
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

  async function fetchInsight() {
    const cached = loadCached();
    if (cached) {
      insight.value = cached.insight;
      return;
    }

    isLoading.value = true;

    try {
      const userData = buildUserData();

      const res = await fetch(`${API_URL}/api/guru/daily-insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData }),
      });

      if (!res.ok) throw new Error('Failed to fetch insight');

      const data = await res.json();
      insight.value = data.insight;
      saveInsight({ insight: data.insight, date: data.date });
    } catch {
      insight.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    insight,
    isLoading,
    fetchInsight,
  };
}
