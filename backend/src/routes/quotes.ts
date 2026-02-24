import { Router } from 'express';
import { MOOD_TYPES } from '@self-mastery/shared';
import { generateQuote } from '../services/quoteGenerator.js';

const router = Router();

router.post('/generate', async (req, res) => {
  const { mood, customLabel, customDescription } = req.body;

  if (!mood) {
    res.status(400).json({ error: 'Mood is required.' });
    return;
  }

  const isStandardMood = MOOD_TYPES.includes(mood);
  const isCustomMood = mood === 'custom' && typeof customLabel === 'string' && customLabel.trim().length > 0;

  if (!isStandardMood && !isCustomMood) {
    res.status(400).json({ error: 'Invalid mood. Must be one of: ' + MOOD_TYPES.join(', ') + ', or "custom" with a customLabel.' });
    return;
  }

  try {
    const quote = await generateQuote(mood, customLabel, customDescription);
    res.json(quote);
  } catch (error) {
    console.error('Quote generation failed:', error);
    res.status(500).json({ error: 'Failed to generate quote. Please try again.' });
  }
});

export default router;
