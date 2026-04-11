import OpenAI from 'openai';
import type { MoodType } from '@self-mastery/shared';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MOOD_CONTEXT: Record<MoodType, string> = {
  low: 'feeling low, heavy, or emotionally drained',
  anxious: 'feeling anxious, restless, or overwhelmed',
  neutral: 'feeling neutral, just existing, neither good nor bad',
  hopeful: 'feeling hopeful and quietly optimistic',
  energized: 'feeling energized and ready to take on the world',
};

function getMoodDescription(mood: string, customLabel?: string, customDescription?: string): string {
  if (mood === 'custom' && customLabel) {
    const desc = customDescription ? ` (${customDescription})` : '';
    return `feeling ${customLabel}${desc}`;
  }
  return MOOD_CONTEXT[mood as MoodType] || `feeling ${mood}`;
}

export async function generateQuote(
  mood: string,
  customLabel?: string,
  customDescription?: string,
): Promise<{ text: string; author: string }> {
  const moodDescription = getMoodDescription(mood, customLabel, customDescription);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `You are a warm, compassionate wellness companion. Your job is to provide a single meaningful quote that resonates with someone who is ${moodDescription}.

Rules:
- Return a real, well-known quote from a real person (author, philosopher, leader, poet, etc.)
- The quote should feel supportive and gentle, not preachy
- Keep the quote short (1 sentence, under 20 words)
- Respond ONLY in JSON: {"text": "the quote", "author": "Author Name"}
- Vary your selections`,
      },
      {
        role: 'user',
        content: `I'm ${moodDescription}. Give me a short quote.`,
      },
    ],
    max_tokens: 256,
  });

  const content = completion.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content);

  if (!parsed.text || !parsed.author) {
    throw new Error('Invalid quote format from OpenAI');
  }

  return { text: parsed.text, author: parsed.author };
}
