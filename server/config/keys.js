/**
 * Server & AI Configuration
 * 
 * NOTE: Keys placed here or in environment variables (.env) are STRICTLY BACKEND ONLY.
 * They are NEVER sent or exposed to the client browser.
 */

require('dotenv').config();

module.exports = {
  // 1. Google Gemini AI API Key
  // Priority: 1) Process ENV (from .env or Vercel Environment Variables) 2) Manual fallback below
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  // Gemini Model identifier (gemini-3.6-flash or gemini-3.8-flash)
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.6-flash',

  // 2. MongoDB Database Connection String
  // Format: mongodb+srv://<username>:<password>@cluster0.mongodb.net/gramsaksham?retryWrites=true&w=majority
  // Or local: mongodb://localhost:27017/gramsaksham
  MONGODB_URI: process.env.MONGODB_URI || '',

  // Server port
  PORT: process.env.PORT || 5000
};
