/**
 * Vercel Serverless Function: /api/config-key
 * Allows manual testing and temporary backend session storage of Gemini API key before deployment.
 * Never exposes the full secret to the client.
 */

const config = require('../server/config/keys');

global._manualGeminiKey = global._manualGeminiKey || '';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Return current status of key
  if (req.method === 'GET') {
    const activeKey = global._manualGeminiKey || config.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    const isConfigured = Boolean(activeKey);
    const masked = isConfigured 
      ? `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}` 
      : 'NOT_CONFIGURED';

    return res.status(200).json({
      configured: isConfigured,
      masked_key: masked,
      source: global._manualGeminiKey ? 'MANUAL_RUNTIME_INPUT' : (process.env.GEMINI_API_KEY ? 'ENV_VARIABLE' : 'NONE'),
      tip: 'You can input a Gemini API Key here to test real AI recommendations before deploying to Vercel.'
    });
  }

  // POST: Disabled for security — keys are strictly backend environment variables
  if (req.method === 'POST') {
    return res.status(403).json({
      success: false,
      error: 'Security Policy: API key modification from frontend is disabled. Configure GEMINI_API_KEY in server/.env or Vercel Environment Variables.',
      configured: Boolean(config.GEMINI_API_KEY || process.env.GEMINI_API_KEY)
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
