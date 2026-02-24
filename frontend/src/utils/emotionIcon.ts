import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';

const ICON_KEYWORDS: Record<string, string[]> = {
  heart: [
    'grateful', 'thankful', 'loved', 'loving', 'caring', 'compassionate',
    'warm', 'tender', 'affectionate', 'kind', 'gentle', 'devoted',
    'romantic', 'connected', 'appreciated', 'blessed',
  ],
  sun: [
    'happy', 'joyful', 'cheerful', 'bright', 'glad', 'delighted',
    'content', 'pleased', 'elated', 'blissful', 'radiant', 'upbeat',
    'lighthearted', 'merry', 'gleeful', 'sunny',
  ],
  flame: [
    'angry', 'frustrated', 'furious', 'irritated', 'mad', 'annoyed',
    'passionate', 'intense', 'fiery', 'heated', 'enraged', 'livid',
    'bitter', 'resentful', 'jealous', 'envious',
  ],
  moon: [
    'tired', 'exhausted', 'sleepy', 'drowsy', 'weary', 'fatigued',
    'drained', 'burnt', 'burned', 'spent', 'lethargic', 'sluggish',
    'restless', 'insomnia',
  ],
  leaf: [
    'peaceful', 'calm', 'serene', 'relaxed', 'tranquil', 'zen',
    'still', 'mellow', 'soothed', 'balanced', 'centered', 'grounded',
    'mindful', 'present', 'quiet',
  ],
  star: [
    'excited', 'proud', 'inspired', 'creative', 'amazing', 'wonderful',
    'thrilled', 'ecstatic', 'fantastic', 'motivated', 'ambitious',
    'determined', 'driven', 'empowered', 'confident', 'accomplished',
  ],
  spiral: [
    'confused', 'lost', 'uncertain', 'overwhelmed', 'dizzy', 'scattered',
    'unsure', 'torn', 'conflicted', 'puzzled', 'perplexed', 'stuck',
    'indecisive', 'doubtful',
  ],
  mountain: [
    'strong', 'resilient', 'brave', 'courageous', 'fearless', 'tough',
    'solid', 'stable', 'steady', 'firm', 'unwavering', 'bold',
    'adventurous', 'free', 'independent',
  ],
  low: [
    'sad', 'down', 'depressed', 'melancholy', 'gloomy', 'somber',
    'heartbroken', 'lonely', 'isolated', 'grief', 'mourning', 'empty',
    'numb', 'hopeless', 'despair',
  ],
  anxious: [
    'anxious', 'nervous', 'worried', 'stressed', 'tense', 'uneasy',
    'panicked', 'afraid', 'scared', 'fearful', 'paranoid', 'apprehensive',
  ],
  hopeful: [
    'hopeful', 'optimistic', 'expectant', 'looking forward', 'positive',
    'promising', 'encouraged', 'wishful',
  ],
  energized: [
    'energized', 'energetic', 'hyper', 'pumped', 'fired', 'alive',
    'vibrant', 'active', 'dynamic', 'unstoppable', 'powerful',
  ],
  dumbbell: [
    'workout', 'exercise', 'gym', 'fitness', 'lift', 'weights', 'strength',
    'training', 'push-up', 'squat', 'stretch',
  ],
  book: [
    'read', 'reading', 'book', 'study', 'learn', 'literature', 'novel',
    'chapter', 'library',
  ],
  laptop: [
    'work', 'code', 'coding', 'program', 'computer', 'laptop', 'focus',
    'deep work', 'project', 'office',
  ],
  droplet: [
    'water', 'hydrate', 'hydration', 'drink', 'fluid',
  ],
  music: [
    'music', 'sing', 'guitar', 'piano', 'instrument', 'song', 'melody',
    'practice music', 'listen',
  ],
  pen: [
    'journal', 'write', 'writing', 'diary', 'note', 'essay', 'letter',
    'blog', 'sketch',
  ],
  coffee: [
    'coffee', 'tea', 'morning routine', 'breakfast', 'brew',
  ],
  running: [
    'run', 'running', 'jog', 'jogging', 'cardio', 'sprint', 'walk',
    'walking', 'hike', 'hiking', 'marathon',
  ],
};

export function matchEmotionIcon(label: string): MoodIconType {
  const lower = label.toLowerCase().trim();

  for (const [icon, keywords] of Object.entries(ICON_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw) || kw.includes(lower))) {
      return icon as MoodIconType;
    }
  }

  return 'star';
}
