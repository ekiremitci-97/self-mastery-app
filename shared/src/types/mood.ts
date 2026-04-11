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

// --- Quadrant-based emotion system ---

export type QuadrantId = 'high-unpleasant' | 'high-pleasant' | 'low-unpleasant' | 'low-pleasant';

export interface Quadrant {
  id: QuadrantId;
  labelKey: string;
  color: string;
  gradient: [string, string];
}

export interface Emotion {
  id: string;
  labelKey: string;
  quadrant: QuadrantId;
}

export const QUADRANTS: Quadrant[] = [
  {
    id: 'high-unpleasant',
    labelKey: 'quadrants.highUnpleasant',
    color: '#E8655A',
    gradient: ['#E8655A', '#D94070'],
  },
  {
    id: 'high-pleasant',
    labelKey: 'quadrants.highPleasant',
    color: '#E8A948',
    gradient: ['#E8A948', '#D4881C'],
  },
  {
    id: 'low-unpleasant',
    labelKey: 'quadrants.lowUnpleasant',
    color: '#8B9FD4',
    gradient: ['#8B9FD4', '#9BAAE0'],
  },
  {
    id: 'low-pleasant',
    labelKey: 'quadrants.lowPleasant',
    color: '#5DC4A8',
    gradient: ['#5DC4A8', '#4DBFA0'],
  },
];

export const EMOTIONS: Emotion[] = [
  // High Energy Unpleasant
  { id: 'angry', labelKey: 'emotions.angry', quadrant: 'high-unpleasant' },
  { id: 'anxious', labelKey: 'emotions.anxious', quadrant: 'high-unpleasant' },
  { id: 'stressed', labelKey: 'emotions.stressed', quadrant: 'high-unpleasant' },
  { id: 'frustrated', labelKey: 'emotions.frustrated', quadrant: 'high-unpleasant' },
  { id: 'overwhelmed', labelKey: 'emotions.overwhelmed', quadrant: 'high-unpleasant' },
  { id: 'restless', labelKey: 'emotions.restless', quadrant: 'high-unpleasant' },
  { id: 'irritated', labelKey: 'emotions.irritated', quadrant: 'high-unpleasant' },
  { id: 'panicked', labelKey: 'emotions.panicked', quadrant: 'high-unpleasant' },
  { id: 'tense', labelKey: 'emotions.tense', quadrant: 'high-unpleasant' },

  // High Energy Pleasant
  { id: 'excited', labelKey: 'emotions.excited', quadrant: 'high-pleasant' },
  { id: 'joyful', labelKey: 'emotions.joyful', quadrant: 'high-pleasant' },
  { id: 'energized', labelKey: 'emotions.energized', quadrant: 'high-pleasant' },
  { id: 'motivated', labelKey: 'emotions.motivated', quadrant: 'high-pleasant' },
  { id: 'confident', labelKey: 'emotions.confident', quadrant: 'high-pleasant' },
  { id: 'inspired', labelKey: 'emotions.inspired', quadrant: 'high-pleasant' },
  { id: 'enthusiastic', labelKey: 'emotions.enthusiastic', quadrant: 'high-pleasant' },
  { id: 'determined', labelKey: 'emotions.determined', quadrant: 'high-pleasant' },
  { id: 'proud', labelKey: 'emotions.proud', quadrant: 'high-pleasant' },

  // Low Energy Unpleasant
  { id: 'sad', labelKey: 'emotions.sad', quadrant: 'low-unpleasant' },
  { id: 'drained', labelKey: 'emotions.drained', quadrant: 'low-unpleasant' },
  { id: 'lonely', labelKey: 'emotions.lonely', quadrant: 'low-unpleasant' },
  { id: 'hopeless', labelKey: 'emotions.hopeless', quadrant: 'low-unpleasant' },
  { id: 'bored', labelKey: 'emotions.bored', quadrant: 'low-unpleasant' },
  { id: 'numb', labelKey: 'emotions.numb', quadrant: 'low-unpleasant' },
  { id: 'discouraged', labelKey: 'emotions.discouraged', quadrant: 'low-unpleasant' },
  { id: 'guilty', labelKey: 'emotions.guilty', quadrant: 'low-unpleasant' },
  { id: 'withdrawn', labelKey: 'emotions.withdrawn', quadrant: 'low-unpleasant' },

  // Low Energy Pleasant
  { id: 'calm', labelKey: 'emotions.calm', quadrant: 'low-pleasant' },
  { id: 'grateful', labelKey: 'emotions.grateful', quadrant: 'low-pleasant' },
  { id: 'content', labelKey: 'emotions.content', quadrant: 'low-pleasant' },
  { id: 'peaceful', labelKey: 'emotions.peaceful', quadrant: 'low-pleasant' },
  { id: 'relaxed', labelKey: 'emotions.relaxed', quadrant: 'low-pleasant' },
  { id: 'hopeful', labelKey: 'emotions.hopeful', quadrant: 'low-pleasant' },
  { id: 'thoughtful', labelKey: 'emotions.thoughtful', quadrant: 'low-pleasant' },
  { id: 'serene', labelKey: 'emotions.serene', quadrant: 'low-pleasant' },
  { id: 'cozy', labelKey: 'emotions.cozy', quadrant: 'low-pleasant' },
];

export function getEmotionsByQuadrant(quadrantId: QuadrantId): Emotion[] {
  return EMOTIONS.filter(e => e.quadrant === quadrantId);
}

export function getQuadrantById(id: QuadrantId): Quadrant | undefined {
  return QUADRANTS.find(q => q.id === id);
}
