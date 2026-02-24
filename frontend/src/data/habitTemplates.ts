import type { MoodIconType } from '@/components/atoms/AppMoodIcon.vue';
import type { TimeOfDay } from '@/composables/useHabits';

export interface HabitTemplate {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: MoodIconType;
  timeOfDay: TimeOfDay;
}

export interface HabitCategory {
  id: string;
  labelKey: string;
  templates: HabitTemplate[];
}

export const HABIT_CATEGORIES: HabitCategory[] = [
  {
    id: 'health',
    labelKey: 'habitTemplates.categories.health',
    templates: [
      {
        id: 'health_meditation',
        nameKey: 'habitTemplates.health.meditation',
        descriptionKey: 'habitTemplates.health.meditationDesc',
        icon: 'leaf',
        timeOfDay: 'morning',
      },
      {
        id: 'health_exercise',
        nameKey: 'habitTemplates.health.exercise',
        descriptionKey: 'habitTemplates.health.exerciseDesc',
        icon: 'dumbbell',
        timeOfDay: 'morning',
      },
      {
        id: 'health_hydration',
        nameKey: 'habitTemplates.health.hydration',
        descriptionKey: 'habitTemplates.health.hydrationDesc',
        icon: 'droplet',
        timeOfDay: 'anytime',
      },
      {
        id: 'health_sleep',
        nameKey: 'habitTemplates.health.sleep',
        descriptionKey: 'habitTemplates.health.sleepDesc',
        icon: 'moon',
        timeOfDay: 'evening',
      },
    ],
  },
  {
    id: 'mindfulness',
    labelKey: 'habitTemplates.categories.mindfulness',
    templates: [
      {
        id: 'mindfulness_journaling',
        nameKey: 'habitTemplates.mindfulness.journaling',
        descriptionKey: 'habitTemplates.mindfulness.journalingDesc',
        icon: 'pen',
        timeOfDay: 'evening',
      },
      {
        id: 'mindfulness_gratitude',
        nameKey: 'habitTemplates.mindfulness.gratitude',
        descriptionKey: 'habitTemplates.mindfulness.gratitudeDesc',
        icon: 'heart',
        timeOfDay: 'morning',
      },
      {
        id: 'mindfulness_breathing',
        nameKey: 'habitTemplates.mindfulness.breathing',
        descriptionKey: 'habitTemplates.mindfulness.breathingDesc',
        icon: 'neutral',
        timeOfDay: 'anytime',
      },
      {
        id: 'mindfulness_bodyscan',
        nameKey: 'habitTemplates.mindfulness.bodyScan',
        descriptionKey: 'habitTemplates.mindfulness.bodyScanDesc',
        icon: 'leaf',
        timeOfDay: 'evening',
      },
    ],
  },
  {
    id: 'productivity',
    labelKey: 'habitTemplates.categories.productivity',
    templates: [
      {
        id: 'productivity_deepwork',
        nameKey: 'habitTemplates.productivity.deepWork',
        descriptionKey: 'habitTemplates.productivity.deepWorkDesc',
        icon: 'laptop',
        timeOfDay: 'morning',
      },
      {
        id: 'productivity_planning',
        nameKey: 'habitTemplates.productivity.planning',
        descriptionKey: 'habitTemplates.productivity.planningDesc',
        icon: 'star',
        timeOfDay: 'morning',
      },
      {
        id: 'productivity_digitaldetox',
        nameKey: 'habitTemplates.productivity.digitalDetox',
        descriptionKey: 'habitTemplates.productivity.digitalDetoxDesc',
        icon: 'leaf',
        timeOfDay: 'evening',
      },
      {
        id: 'productivity_learning',
        nameKey: 'habitTemplates.productivity.learning',
        descriptionKey: 'habitTemplates.productivity.learningDesc',
        icon: 'book',
        timeOfDay: 'afternoon',
      },
    ],
  },
  {
    id: 'selfcare',
    labelKey: 'habitTemplates.categories.selfCare',
    templates: [
      {
        id: 'selfcare_skincare',
        nameKey: 'habitTemplates.selfCare.skincare',
        descriptionKey: 'habitTemplates.selfCare.skincareDesc',
        icon: 'sun',
        timeOfDay: 'morning',
      },
      {
        id: 'selfcare_reading',
        nameKey: 'habitTemplates.selfCare.reading',
        descriptionKey: 'habitTemplates.selfCare.readingDesc',
        icon: 'book',
        timeOfDay: 'evening',
      },
      {
        id: 'selfcare_nature',
        nameKey: 'habitTemplates.selfCare.nature',
        descriptionKey: 'habitTemplates.selfCare.natureDesc',
        icon: 'hopeful',
        timeOfDay: 'afternoon',
      },
      {
        id: 'selfcare_creative',
        nameKey: 'habitTemplates.selfCare.creative',
        descriptionKey: 'habitTemplates.selfCare.creativeDesc',
        icon: 'music',
        timeOfDay: 'anytime',
      },
    ],
  },
  {
    id: 'social',
    labelKey: 'habitTemplates.categories.social',
    templates: [
      {
        id: 'social_callfriend',
        nameKey: 'habitTemplates.social.callFriend',
        descriptionKey: 'habitTemplates.social.callFriendDesc',
        icon: 'heart',
        timeOfDay: 'evening',
      },
      {
        id: 'social_listening',
        nameKey: 'habitTemplates.social.listening',
        descriptionKey: 'habitTemplates.social.listeningDesc',
        icon: 'neutral',
        timeOfDay: 'anytime',
      },
      {
        id: 'social_compliment',
        nameKey: 'habitTemplates.social.compliment',
        descriptionKey: 'habitTemplates.social.complimentDesc',
        icon: 'sun',
        timeOfDay: 'anytime',
      },
    ],
  },
];

export const ALL_ICONS: { type: MoodIconType; labelKey: string }[] = [
  { type: 'heart', labelKey: 'icons.heart' },
  { type: 'sun', labelKey: 'icons.sun' },
  { type: 'flame', labelKey: 'icons.flame' },
  { type: 'moon', labelKey: 'icons.moon' },
  { type: 'leaf', labelKey: 'icons.leaf' },
  { type: 'star', labelKey: 'icons.star' },
  { type: 'mountain', labelKey: 'icons.mountain' },
  { type: 'energized', labelKey: 'icons.energized' },
  { type: 'hopeful', labelKey: 'icons.hopeful' },
  { type: 'neutral', labelKey: 'icons.neutral' },
  { type: 'low', labelKey: 'icons.low' },
  { type: 'anxious', labelKey: 'icons.anxious' },
  { type: 'spiral', labelKey: 'icons.spiral' },
  { type: 'dumbbell', labelKey: 'icons.dumbbell' },
  { type: 'book', labelKey: 'icons.book' },
  { type: 'laptop', labelKey: 'icons.laptop' },
  { type: 'droplet', labelKey: 'icons.droplet' },
  { type: 'music', labelKey: 'icons.music' },
  { type: 'pen', labelKey: 'icons.pen' },
  { type: 'coffee', labelKey: 'icons.coffee' },
  { type: 'running', labelKey: 'icons.running' },
];
