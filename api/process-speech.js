/**
 * Vercel Serverless Function: POST /api/process-speech
 * Processes voice / conversational speech turns using conversational agent engine.
 */

const { processUserSpeech } = require('../server/engine/conversational_agent');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { speechText, currentStep, currentProfile } = req.body || {};
    const result = processUserSpeech(speechText, currentStep, currentProfile);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[API Error /process-speech]:', error);
    return res.status(500).json({ error: error.message });
  }
};
