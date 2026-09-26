/**
 * Vercel Serverless Function: GET /api/health
 * Health check reporting Gemini AI status and MongoDB connection state.
 */

const { connectToDatabase, getDatabaseStatus } = require('../server/lib/mongodb');
const config = require('../server/config/keys');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectToDatabase();
  const dbStatus = getDatabaseStatus();

  const hasGeminiKey = Boolean((config.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim());

  return res.status(200).json({
    status: 'online',
    system: 'Gram Saksham MoSJE Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    ai_engine: {
      provider: 'Google Gemini AI',
      model: config.GEMINI_MODEL || 'gemini-3.6-flash',
      api_key_configured: hasGeminiKey,
      status: hasGeminiKey ? 'ACTIVE' : 'FALLBACK_TO_RULE_ENGINE'
    },
    database: dbStatus,
    runtime: process.env.VERCEL ? 'Vercel Serverless Function' : 'Node.js Express Local'
  });
};
