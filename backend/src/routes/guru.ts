import { Router } from 'express';
import { chat, generateDailyInsight } from '../services/guruChat.js';
import type { UserData, ChatMessage } from '../services/guruChat.js';
import { textToSpeech } from '../services/tts.js';

const router = Router();

router.post('/chat', async (req, res) => {
  const { message, chatHistory, userData } = req.body as {
    message?: string;
    chatHistory?: ChatMessage[];
    userData?: UserData;
  };

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  if (!userData) {
    res.status(400).json({ error: 'User data is required.' });
    return;
  }

  try {
    const reply = await chat(message.trim(), chatHistory ?? [], userData);
    res.json({ reply });
  } catch (error) {
    console.error('Guru chat failed:', error);
    res.status(500).json({ error: 'Failed to get a response. Please try again.' });
  }
});

router.post('/daily-insight', async (req, res) => {
  const { userData } = req.body as { userData?: UserData };

  if (!userData) {
    res.status(400).json({ error: 'User data is required.' });
    return;
  }

  try {
    const insight = await generateDailyInsight(userData);
    const date = new Date().toISOString().slice(0, 10);
    res.json({ insight, date });
  } catch (error) {
    console.error('Daily insight generation failed:', error);
    res.status(500).json({ error: 'Failed to generate insight. Please try again.' });
  }
});

router.post('/tts', async (req, res) => {
  const { text } = req.body as { text?: string };

  if (!text || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Text is required.' });
    return;
  }

  if (text.length > 5000) {
    res.status(400).json({ error: 'Text must be under 5000 characters.' });
    return;
  }

  try {
    const audioBuffer = await textToSpeech(text.trim());
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString(),
      'Cache-Control': 'public, max-age=86400',
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS failed:', error);
    res.status(500).json({ error: 'Failed to generate speech.' });
  }
});

export default router;
