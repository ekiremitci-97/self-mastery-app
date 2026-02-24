export declare const MOOD_TYPES: readonly ["low", "anxious", "neutral", "hopeful", "energized"];
export type MoodType = (typeof MOOD_TYPES)[number];
export interface MoodOption {
    type: MoodType;
    emoji: string;
    labelKey: string;
    descriptionKey: string;
}
export declare const MOOD_OPTIONS: MoodOption[];
//# sourceMappingURL=mood.d.ts.map