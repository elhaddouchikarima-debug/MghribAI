require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const destinationsRouter = require('./routes/destinations');
const { router: recommendationsRouter } = require('./routes/recommendations');
const { router: voiceTranslateRouter } = require('./routes/voiceTranslate');
const translateRouter = require('./routes/translate');

const app = express();
app.use(cors());
app.use(express.json());

// L-site (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Test: wach l-backend khdam
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API
app.use('/api/destinations', destinationsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/translate', translateRouter);
app.use('/api/voice-translate', express.raw({ type: 'audio/*', limit: '5mb' }), voiceTranslateRouter);

// Ay /api/... machi mawjoud
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Erreurs
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Recording is too large. Keep it under 5 MB and 60 seconds.' });
  if (req.originalUrl.startsWith('/api/voice-translate')) return res.status(400).json({ error: 'The audio request could not be read. Record again and retry.' });
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaghribAI backend: http://localhost:${PORT}`);
});
