import { z } from 'zod';
import { MOOD_TYPES } from '../types/mood';
export const CreateMoodEntrySchema = z.object({
    mood: z.enum(MOOD_TYPES),
    note: z.string().max(500).optional(),
});
//# sourceMappingURL=mood.js.map