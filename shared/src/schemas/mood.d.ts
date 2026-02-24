import { z } from 'zod';
export declare const CreateMoodEntrySchema: z.ZodObject<{
    mood: z.ZodEnum<["low", "anxious", "neutral", "hopeful", "energized"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    mood: "low" | "anxious" | "neutral" | "hopeful" | "energized";
    note?: string | undefined;
}, {
    mood: "low" | "anxious" | "neutral" | "hopeful" | "energized";
    note?: string | undefined;
}>;
export type CreateMoodEntryDto = z.infer<typeof CreateMoodEntrySchema>;
//# sourceMappingURL=mood.d.ts.map