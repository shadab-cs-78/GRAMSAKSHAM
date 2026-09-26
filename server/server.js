const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToDatabase, getDatabaseStatus } = require('./lib/mongodb');
const config = require('./config/keys');
const apiRoutes = require('./routes/api');
const ivrRoutes = require('./routes/ivr');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);
app.use('/api/ivr', ivrRoutes);

// Comprehensive Health check
app.get('/health', async (req, res) => {
  const dbStatus = getDatabaseStatus();
  const hasGeminiKey = Boolean((config.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim());

  res.json({
    status: 'online',
    system: 'Gram Saksham MoSJE PM-AJAY AI Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    ai_engine: {
      provider: 'Google Gemini AI',
      model: config.GEMINI_MODEL || 'gemini-3.6-flash',
      api_key_configured: hasGeminiKey,
      status: hasGeminiKey ? 'ACTIVE (Google Gemini)' : 'FALLBACK (NSQF Rule Engine)'
    },
    database: dbStatus
  });
});

app.listen(PORT, async () => {
  console.log(`[GramSaksham Server] Running on http://localhost:${PORT}`);
  // Attempt initial database connection asynchronously
  await connectToDatabase();
});
