export const MOOD_TYPES = [
  'low',
  'anxious',
  'neutral',
  'hopeful',
  'energized',
] as const;

export type MoodType = (typeof MOOD_TYPES)[number];

export interface MoodOption {
  type: MoodType;
  emoji: string;
  labelKey: string;
  descriptionKey: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { type: 'low', emoji: '🌧️', labelKey: 'moods.low', descriptionKey: 'moods.lowDesc' },
  { type: 'anxious', emoji: '🌊', labelKey: 'moods.anxious', descriptionKey: 'moods.anxiousDesc' },
  { type: 'neutral', emoji: '🌤️', labelKey: 'moods.neutral', descriptionKey: 'moods.neutralDesc' },
  { type: 'hopeful', emoji: '🌱', labelKey: 'moods.hopeful', descriptionKey: 'moods.hopefulDesc' },
  { type: 'energized', emoji: '⚡', labelKey: 'moods.energized', descriptionKey: 'moods.energizedDesc' },
];
