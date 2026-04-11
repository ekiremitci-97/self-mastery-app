import { Router } from 'express';
import { MOOD_TYPES, EMOTIONS } from '@self-mastery/shared';
import { generateQuote } from '../services/quoteGenerator.js';

const router = Router();

router.post('/generate', async (req, res) => {
  const { mood, quadrant, customLabel, customDescription } = req.body;

  if (!mood || typeof mood !== 'string') {
    res.status(400).json({ error: 'Mood is required.' });
    return;
  }

  const isStandardMood = MOOD_TYPES.includes(mood as any);
  const isEmotionId = EMOTIONS.some(e => e.id === mood);
  const isCustomMood = mood === 'custom' && typeof customLabel === 'string' && customLabel.trim().length > 0;

  if (!isStandardMood && !isEmotionId && !isCustomMood) {
    res.status(400).json({ error: 'Invalid mood.' });
    return;
  }

  try {
    // Emotion IDs (e.g. "joyful", "angry") are passed as custom labels
    if (isEmotionId && !isStandardMood) {
      const quote = await generateQuote('custom', mood, quadrant);
      res.json(quote);
    } else {
      const quote = await generateQuote(mood, customLabel, customDescription);
      res.json(quote);
    }
  } catch (error) {
    console.error('Quote generation failed:', error);
    res.status(500).json({ error: 'Failed to generate quote. Please try again.' });
  }
});

export default router;
