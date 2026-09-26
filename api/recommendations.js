/**
 * Vercel Serverless Function: POST /api/recommendations
 * Powered by Google Gemini AI with fallback to NSQF MADM Rule Engine
 */

const { generateGeminiRecommendations } = require('../server/engine/gemini_engine');
const { connectToDatabase } = require('../server/lib/mongodb');
const Opportunity = require('../server/models/Opportunity');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-gemini-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { profile, lang = 'hi' } = req.body || {};
    const customApiKey = req.headers['x-gemini-key'] || req.body?.customApiKey || '';

    // Attempt connecting to MongoDB (caching handles speed)
    await connectToDatabase();

    // Call Gemini AI Engine
    const result = await generateGeminiRecommendations(profile, customApiKey, lang);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[API Error /recommendations]:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
