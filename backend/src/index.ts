import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import quotesRouter from './routes/quotes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/quotes', quotesRouter);

app.listen(PORT, () => {
  console.log(`Self-Mastery API running on port ${PORT}`);
});
