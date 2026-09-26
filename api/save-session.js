/**
 * Vercel Serverless Function: POST /api/save-session
 * Saves beneficiary session to MongoDB with in-memory fallback.
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const BeneficiarySession = require('../server/models/BeneficiarySession');

// In-memory fallback array
global._inMemoryBeneficiaries = global._inMemoryBeneficiaries || [];

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
    const { profile, selectedOpportunity, feedback } = req.body || {};
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const refId = `GS${dateStr}-${randomSuffix}`;

    const record = {
      reference_id: refId,
      name: profile?.name || "लाभार्थी (Beneficiary)",
      phone: profile?.phone || "98765" + Math.floor(10000 + Math.random() * 90000),
      district: profile?.district || "Jabalpur",
      village_or_location: profile?.locationName || profile?.location || "Rural Cluster",
      coordinates: profile?.coordinates || { lat: 23.1815, lng: 79.9650 },
      education: profile?.education || "secondary",
      skills: profile?.skills || "farming",
      interests: profile?.interests || ["Electrical"],
      employment_preference: profile?.employment_preference || "self",
      recommended_trade: selectedOpportunity?.title_hi || "इलेक्ट्रीशियन (ITI)",
      selected_opportunity: selectedOpportunity,
      status: "REGISTERED",
      feedback: feedback || "helpful",
      channel: profile?.channel || "KIOSK",
      createdAt: now
    };

    const conn = await connectToDatabase();
    let savedToMongo = false;

    if (conn) {
      try {
        await BeneficiarySession.create(record);
        savedToMongo = true;
      } catch (dbErr) {
        console.warn('[MongoDB Save Error, using fallback]:', dbErr.message);
      }
    }

    // Always push to in-memory store as well
    global._inMemoryBeneficiaries.unshift(record);

    return res.status(200).json({
      success: true,
      reference_id: refId,
      saved_to_mongodb: savedToMongo,
      storage_mode: savedToMongo ? 'MONGODB_ATLAS' : 'IN_MEMORY_STORE',
      record
    });
  } catch (error) {
    console.error('[API Error /save-session]:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
