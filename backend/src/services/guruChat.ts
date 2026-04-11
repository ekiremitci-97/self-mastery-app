import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = 'gpt-5.2-chat-latest';

export interface UserData {
  moodHistory: { mood: string; note: string | null; date: string }[];
  habitStats: { name: string; completionRate: number; currentStreak: number; bestStreak: number }[];
  overallStreak: number;
  overallCompletionRate: number;
  savedQuotesCount: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function buildUserContext(userData: UserData): string {
  const parts: string[] = [];

  if (userData.moodHistory.length > 0) {
    const recent = userData.moodHistory.slice(0, 14);
    const moodSummary = recent
      .map(m => `${m.date}: ${m.mood}${m.note ? ` ("${m.note}")` : ''}`)
      .join('\n');
    parts.push(`Recent mood check-ins (last ${recent.length} entries):\n${moodSummary}`);
  } else {
    parts.push('No mood check-ins recorded yet.');
  }

  if (userData.habitStats.length > 0) {
    const habitSummary = userData.habitStats
      .map(h => `- ${h.name}: ${Math.round(h.completionRate * 100)}% completion, ${h.currentStreak}d current streak (best: ${h.bestStreak}d)`)
      .join('\n');
    parts.push(`Habit performance:\n${habitSummary}`);
  } else {
    parts.push('No habits tracked yet.');
  }

  parts.push(`Overall: ${Math.round(userData.overallCompletionRate * 100)}% completion rate, ${userData.overallStreak}d streak`);
  parts.push(`Saved quotes: ${userData.savedQuotesCount}`);

  return parts.join('\n\n');
}

const SYSTEM_PROMPT = `You are the Self-Mastery Guru, a warm, wise, and calm personal wellness mentor.

Personality:
- Speak like a thoughtful friend, not a therapist or chatbot
- Be concise (2-4 sentences per response unless the user asks for more)
- Never judgmental, always supportive
- Reference the user's actual data when relevant
- Use gentle encouragement, not toxic positivity

Formatting rules:
- NEVER use dashes (hyphens, em dashes, en dashes) in your responses. Use commas, periods, or line breaks instead.
- You may use **bold** for emphasis when needed.
- Keep formatting minimal and natural.

Guidelines:
- If mood has been consistently low, acknowledge it gently and explore
- If habits are strong, celebrate the consistency
- If streaks are broken, normalize it. One day doesn't erase progress.
- Ask follow-up questions to deepen the conversation
- Suggest specific, actionable steps when appropriate
- Do not use emojis unless the user does first`;

export async function chat(
  message: string,
  chatHistory: ChatMessage[],
  userData: UserData,
): Promise<string> {
  const userContext = buildUserContext(userData);

  const systemContent = `${SYSTEM_PROMPT}\n\nHere is the user's current wellness data:\n${userContext}`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
    ...chatHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    reasoning_effort: 'medium' as any,
    max_completion_tokens: 2048,
  });

  const reply = completion.choices[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('No response from OpenAI');
  }

  return reply;
}

export async function generateDailyInsight(userData: UserData): Promise<string> {
  const userContext = buildUserContext(userData);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}

Your task: Generate a single daily insight for the user based on their wellness data. This is a proactive message — the user did not ask for it. Keep it to 1-2 sentences. Be specific to their data, not generic. If their data is empty, give a warm welcome message encouraging them to start.`,
      },
      {
        role: 'user',
        content: `Here is my current wellness data:\n${userContext}\n\nGive me my daily insight.`,
      },
    ],
    reasoning_effort: 'medium' as any,
    max_completion_tokens: 1024,
  });

  const insight = completion.choices[0]?.message?.content?.trim();

  if (!insight) {
    throw new Error('No response from OpenAI');
  }

  return insight;
}
