require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const destinationsRouter = require('./routes/destinations');

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

// Ay /api/... machi mawjoud
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MaghribAI backend: http://localhost:${PORT}`);
});