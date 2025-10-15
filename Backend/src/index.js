const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { query } = require('./db/mysql');

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: env.nodeEnv });
});

// Simple DB ping route
app.get('/api/db-ping', async (req, res) => {
  try {
    const rows = await query('SELECT NOW() as now');
    res.json({ ok: true, now: rows[0].now || rows[0].NOW || rows[0]['NOW()'] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = env.port || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
