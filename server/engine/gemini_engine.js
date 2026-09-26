/**
 * Google Gemini AI Engine for Intelligent Livelihood & NSQF Recommendations
 * Integrates directly with Google Generative Language API (gemini-3.7-flash / gemini-3.8-flash)
 * with zero external NPM package dependencies (uses native fetch).
 */

const config = require('../config/keys');
const opportunitiesData = require('../data/master_opportunities.json');
const { getRecommendations: getRuleBasedRecommendations } = require('./recommendation_engine');

// Language names for prompt localization
const LANG_NAMES = {
  hi: 'Hindi (हिंदी)',
  en: 'English',
  bn: 'Bengali (বাংলা)',
  te: 'Telugu (తెలుగు)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)'
};

const MODELS_TO_TRY = [
  config.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

/**
 * Call Gemini AI API to generate intelligent, personalized recommendations
 * @param {Object} profile - Candidate assessment profile
 * @param {string} customApiKey - Optional manual key provided at runtime
 * @param {string} lang - Selected language code ('hi', 'en', 'bn', 'te', 'pa')
 */
async function generateGeminiRecommendations(profile = {}, customApiKey = '', lang = 'hi') {
  const apiKey = (customApiKey || config.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();

  // If no Gemini API key is configured, cleanly fall back to rule-based engine
  if (!apiKey) {
    console.log('[Gemini Engine] No Gemini API key provided. Using rule-based NSQF matching engine.');
    const fallbackRecs = getRuleBasedRecommendations(profile);
    return {
      ai_source: 'nsqf_rule_engine',
      model: 'nsqf_madm_v1',
      is_fallback: true,
      message: 'Running via local NSQF rule-based matching. (Add GEMINI_API_KEY for live generative AI)',
      recommendations: fallbackRecs
    };
  }

  const targetLanguage = LANG_NAMES[lang] || 'Hindi (हिंदी)';

  // Build specialized prompt for Indian rural livelihood mapping under PM-AJAY GIA
  const systemInstruction = `You are the Gram Saksham AI Livelihood Advisory Engine developed for the Ministry of Social Justice and Empowerment (MoSJE), Government of India, under the PM-AJAY GIA Component (Problem Statement ID 26097).
Your mission is to map rural Scheduled Caste (SC) candidates to accredited NSQF skilling courses, wage employment, and ₹50,000 capital subsidy self-employment opportunities.

Given the candidate's profile and the available catalog, analyze the candidate's background and select the top 6 to 8 best matching opportunities covering all three essential categories:
- NSQF Training Courses (category: 'training')
- City & Local Wage Employment (category: 'job')
- Self-Employment Micro-Enterprises & ₹50,000 Grants (category: 'self_employment' or 'grant')
Ensure at least 2 opportunities are provided for each category so the candidate has complete options across training, jobs, and business.
CRITICAL RULES:
1. Explain WHY each opportunity matches the candidate in exactly 3 bullet points, written in ${targetLanguage}.
2. Ensure bullet 1 references their Education and prior traditional skills (Recognition of Prior Learning - RPL).
3. Ensure bullet 2 references their newly stated interest, local district demand, or salary/vacancies.
4. Ensure bullet 3 references PM-AJAY GIA benefits (e.g. ₹50,000 capital subsidy, salary, or ₹1,500-₹4,500/month training stipend).
5. Output STRICTLY valid JSON conforming to the requested schema. No markdown backticks outside JSON.`;

  const userPrompt = `CANDIDATE PROFILE:
- Education: ${profile.education || 'secondary'}
- Traditional/Existing Skills: ${profile.skills || 'farming'}
- Stated New Interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests || 'electrician'}
- Candidate Location / Village: ${profile.locationName || profile.district || 'Jabalpur / Rural Cluster'}
- Employment Preference: ${profile.employment_preference || 'self'} (self = self-employment shop, wage = company job, both = open to both)
- Preferred Language: ${targetLanguage}

AVAILABLE OPPORTUNITIES CATALOG:
${JSON.stringify(opportunitiesData, null, 2)}

Return a JSON object formatted as:
{
  "recommendations": [
    {
      "id": "<opportunity id matching catalog>",
      "title_hi": "<Hindi title>",
      "title_en": "<English title>",
      "category": "<training|job|self_employment|grant>",
      "nsqf_level": <number>,
      "duration": "<duration>",
      "suitable_for": [
        "<Point 1 in ${targetLanguage}>",
        "<Point 2 in ${targetLanguage}>",
        "<Point 3 in ${targetLanguage}>"
      ],
      "institute": {
        "name_hi": "<institute name>",
        "name_en": "<institute name in en>",
        "distance_km": <estimated distance number>,
        "contact": "<contact>",
        "address": "<address>"
      },
      "employment_type": "<self|wage|both>",
      "pm_ajay_benefits": {
        "capital_subsidy": "<subsidy details>",
        "stipend": "<stipend details>",
        "toolkit": "<toolkit details>"
      },
      "image_type": "<electrician|mobile|solar|agriculture|tailoring|computer|food>"
    }
  ]
}`;

  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      console.log(`[Gemini Engine] Querying Google Gemini API (${model})...`);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Gemini Engine] Model ${model} returned HTTP ${response.status}:`, errText);
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
        continue; // try next model
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      
      let candidateText = '';
      for (const p of parts) {
        if (p.text && !p.thought) {
          candidateText = p.text;
          break;
        }
      }
      if (!candidateText && parts.length > 0) {
        candidateText = parts[parts.length - 1].text || '';
      }

      if (!candidateText) {
        throw new Error('Gemini API returned empty text response');
      }

      const cleanJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      const recs = parsed.recommendations || (Array.isArray(parsed) ? parsed : null);

      if (!Array.isArray(recs) || recs.length === 0) {
        throw new Error('Parsed response does not contain an array of recommendations');
      }

      console.log(`[Gemini Engine] Successfully generated ${recs.length} AI-tailored recommendations using ${model}!`);

      // Merge remaining opportunities for the candidate's district so all tabs (Training, Jobs, Self-Employment) have full options
      const userDistrict = (profile.district || profile.locationName || '').toLowerCase();
      const existingIds = new Set(recs.map(r => r.id));
      
      const additionalOpportunities = opportunitiesData.filter(item => {
        if (existingIds.has(item.id)) return false;
        if (!userDistrict) return true;
        return item.districts && item.districts.some(d => userDistrict.includes(d.toLowerCase()) || d.toLowerCase().includes(userDistrict));
      });

      const fullMergedList = [...recs, ...additionalOpportunities];

      return {
        ai_source: 'google_gemini',
        model,
        is_fallback: false,
        timestamp: new Date().toISOString(),
        recommendations: fullMergedList
      };
    } catch (err) {
      console.warn(`[Gemini Engine] Error with model ${model}:`, err.message);
      lastError = err;
    }
  }

  // If all models failed, fall back safely
  console.warn('[Gemini Engine Fallback Triggered]:', lastError?.message);
  const fallbackRecs = getRuleBasedRecommendations(profile);
  return {
    ai_source: 'nsqf_rule_engine',
    model: 'nsqf_madm_v1',
    is_fallback: true,
    error_notice: lastError?.message,
    recommendations: fallbackRecs
  };
}

module.exports = {
  generateGeminiRecommendations
};
