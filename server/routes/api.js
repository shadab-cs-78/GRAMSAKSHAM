const express = require('express');
const router = express.Router();
const { generateGeminiRecommendations } = require('../engine/gemini_engine');
const { processUserSpeech } = require('../engine/conversational_agent');
const { connectToDatabase, getDatabaseStatus } = require('../lib/mongodb');
const BeneficiarySession = require('../models/BeneficiarySession');
const PerspectiveBatch = require('../models/PerspectiveBatch');
const DistrictCensus = require('../models/DistrictCensus');
const Opportunity = require('../models/Opportunity');
const SkillCenter = require('../models/SkillCenter');
const Scheme = require('../models/Scheme');
const DistrictInfo = require('../models/DistrictInfo');

const censusData = require('../data/census_sc_data.json');
const masterOpportunities = require('../data/master_opportunities.json');
const masterSkillCenters = require('../data/master_skill_centers.json');
const masterSchemes = require('../data/master_schemes.json');
const masterDistricts = require('../data/master_districts.json');
const config = require('../config/keys');

// In-memory persistent array for fallback
global._inMemoryBeneficiaries = global._inMemoryBeneficiaries || [
  {
    reference_id: "GS20260920-1234",
    name: "राजेश अहिरवार (Rajesh Ahirwar)",
    phone: "9876543210",
    district: "Jabalpur",
    village_or_location: "कुंडम (जनजातीय ब्लॉक)",
    education: "10वीं पास",
    interests: ["Electrician", "Mobile Repairing"],
    recommended_trade: "इलेक्ट्रीशियन (ITI)",
    status: "ENROLLED",
    date: "2026-09-20",
    channel: "KIOSK"
  },
  {
    reference_id: "GS20260920-1235",
    name: "सुनीता बाई (Sunita Bai)",
    phone: "9876501234",
    district: "Morena",
    village_or_location: "मुरैना ग्रामीण",
    education: "5वीं पास",
    interests: ["Tailoring", "Boutique"],
    recommended_trade: "सिलाई मशीन ऑपरेटर एवं बुटीक",
    status: "SUBSIDY_APPLIED",
    date: "2026-09-20",
    channel: "IVR_PHONE"
  }
];

// 0. Health check
router.get('/health', async (req, res) => {
  const dbStatus = getDatabaseStatus();
  const hasGeminiKey = Boolean((config.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim());

  res.json({
    status: 'online',
    system: 'Gram Saksham MoSJE PM-AJAY AI Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    ai_engine: {
      provider: 'Google Gemini AI',
      model: config.GEMINI_MODEL || 'gemini-3.7-flash',
      api_key_configured: hasGeminiKey,
      status: hasGeminiKey ? 'ACTIVE (Google Gemini)' : 'FALLBACK (NSQF Rule Engine)'
    },
    database: dbStatus
  });
});

// 1. Process voice / speech turn
router.post('/process-speech', (req, res) => {
  const { speechText, currentStep, currentProfile } = req.body;
  const result = processUserSpeech(speechText, currentStep, currentProfile);
  res.json(result);
});

// 2. Fetch Gemini AI Recommendations based on gathered profile
router.post('/recommendations', async (req, res) => {
  try {
    const { profile, lang = 'hi' } = req.body || {};
    const customApiKey = req.headers['x-gemini-key'] || req.body?.customApiKey || '';
    
    // Call Gemini AI Engine with fallback
    const result = await generateGeminiRecommendations(profile, customApiKey, lang);
    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error('[API /recommendations Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Save completed beneficiary session (MongoDB + in-memory fallback)
router.post('/save-session', async (req, res) => {
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
      date: now.toISOString().slice(0, 10),
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
        console.warn('[MongoDB Save Error]:', dbErr.message);
      }
    }

    global._inMemoryBeneficiaries.unshift(record);

    res.json({
      success: true,
      reference_id: refId,
      saved_to_mongodb: savedToMongo,
      storage_mode: savedToMongo ? 'MONGODB_ATLAS' : 'IN_MEMORY_STORE',
      record
    });
  } catch (err) {
    console.error('[API /save-session Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Admin API: Beneficiary list
router.get('/beneficiaries', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    let records = [];

    if (conn) {
      records = await BeneficiarySession.find({}).sort({ createdAt: -1 }).lean();
    }

    if (!records || records.length === 0) {
      records = global._inMemoryBeneficiaries;
    }

    res.json({
      success: true,
      total: records.length,
      storage: conn ? 'MONGODB_ATLAS' : 'IN_MEMORY_CACHE',
      beneficiaries: records
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Admin API: Perspective Planning & Scheme Stats for MoSJE
router.get('/perspective-plan', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    let batches = [];

    if (conn) {
      batches = await PerspectiveBatch.find({}).lean();
    }

    if (!batches || batches.length === 0) {
      batches = [
        {
          batch_id: "BATCH-JBP-ELEC-01",
          district: "Jabalpur",
          trade: "इलेक्ट्रीशियन (ITI - NSQF Level 4)",
          candidates: 30,
          center: "Govt ITI जबलपुर",
          financial_mentor: "श्री अमित वर्मा (LBO PNB)",
          status: "प्रशिक्षण जारी (In Progress)",
          placement_partner: "MPPKVVCL / स्थानीय कांट्रेक्टर"
        },
        {
          batch_id: "BATCH-MOR-AGRI-02",
          district: "Morena",
          trade: "डेयरी एवं पशु आहार मूल्य संवर्धन (NSQF 3)",
          candidates: 30,
          center: "RSETI मुरैना",
          financial_mentor: "श्रीमती रेखा पटेल (CFC Mitra)",
          status: "बैच पूर्ण - टूलकिट वितरण (Toolkit Stage)",
          placement_partner: "जिला उद्योग केंद्र SHG फेडरेशन"
        },
        {
          batch_id: "BATCH-SHD-DIGI-03",
          district: "Shahdol",
          trade: "डिजिटल सेवा केंद्र (CSC) सहायक (NSQF 4)",
          candidates: 28,
          center: "PMKK कौशल केंद्र शहडोल",
          financial_mentor: "श्री आर. के. तिवारी (नाबार्ड प्रतिनिधि)",
          status: "प्रवेश प्रक्रिया (Enrollment Open)",
          placement_partner: "CSC e-Governance Services"
        },
        {
          batch_id: "BATCH-RTL-TAILOR-04",
          district: "Ratlam",
          trade: "सिलाई मशीन ऑपरेटर एवं बुटीक (NSQF 3)",
          candidates: 30,
          center: "RSETI रतलाम",
          financial_mentor: "श्री विजय शर्मा (CFC Mitra)",
          status: "प्रशिक्षण जारी (In Progress)",
          placement_partner: "रतलाम रेडीमेड गारमेंट क्लस्टर"
        }
      ];
    }

    // Helper to get fresh census summary
    const getFreshCensusData = () => {
      try {
        const fs = require('fs');
        const path = require('path');
        const raw = fs.readFileSync(path.join(__dirname, '../data/census_sc_data.json'), 'utf-8');
        return JSON.parse(raw);
      } catch {
        return censusData;
      }
    };

    const freshCensus = getFreshCensusData();

    res.json({
      success: true,
      district_coverage: ["Shahdol", "Ratlam", "Morena", "Rewa", "Jabalpur"],
      active_districts: freshCensus.districts,
      sc_population_coverage: "82%",
      active_kiosks: 24,
      ivr_calls_handled: 1840,
      total_screened: (global._inMemoryBeneficiaries?.length || 0) + 380,
      gia_subsidy_allocated: "₹38,50,000",
      batches_formed: batches
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. District PCA SC Census Data API
router.get('/census', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const raw = fs.readFileSync(path.join(__dirname, '../data/census_sc_data.json'), 'utf-8');
    const freshCensus = JSON.parse(raw);
    res.json({
      success: true,
      source: "pca_state_distt_sc.xls",
      districts_covered: freshCensus.districts
    });
  } catch (e) {
    res.json({
      success: true,
      source: "pca_state_distt_sc.xls",
      districts_covered: censusData.districts
    });
  }
});

// 7. Gemini API Key Status (Read-Only)
router.get('/config-key', (req, res) => {
  const activeKey = config.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const isConfigured = Boolean(activeKey);
  res.json({
    configured: isConfigured,
    masked_key: isConfigured ? `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}` : 'NOT_CONFIGURED',
    model: config.GEMINI_MODEL || 'gemini-3.7-flash',
    source: process.env.GEMINI_API_KEY ? 'ENV_VARIABLE (.env / Vercel)' : (config.GEMINI_API_KEY ? 'BACKEND_MANUAL_CONFIG' : 'NONE')
  });
});

router.post('/config-key', (req, res) => {
  return res.status(403).json({
    success: false,
    error: 'Security Policy: API key injection from browser is disabled. Configure GEMINI_API_KEY in server/.env or Vercel Environment Variables.'
  });
});

// 8. Opportunities Catalog (Training, City Jobs, Self-Employment Business, Grants)
router.get('/opportunities', async (req, res) => {
  try {
    const { category, district } = req.query;
    await connectToDatabase();

    let query = {};
    if (category) query.category = category;
    if (district) query.districts = { $in: [new RegExp(district, 'i')] };

    let results = await Opportunity.find(query).lean();
    if (!results || results.length === 0) {
      // In-memory fallback from master json
      results = masterOpportunities.filter(item => {
        const matchesCat = !category || item.category === category;
        const matchesDist = !district || (item.districts && item.districts.some(d => d.toLowerCase() === district.toLowerCase()));
        return matchesCat && matchesDist;
      });
    }

    res.json({
      success: true,
      count: results.length,
      opportunities: results
    });
  } catch (err) {
    res.json({
      success: true,
      count: masterOpportunities.length,
      opportunities: masterOpportunities
    });
  }
});

// 9. Skill Centers Directory (PMKKs, KVKs, RSETIs, Industry Clusters)
router.get('/skill-centers', async (req, res) => {
  try {
    const { district, type } = req.query;
    await connectToDatabase();

    let query = {};
    if (district) query.district = new RegExp(district, 'i');
    if (type) query.type = type;

    let results = await SkillCenter.find(query).lean();
    if (!results || results.length === 0) {
      results = masterSkillCenters.filter(sc => {
        const matchesDist = !district || sc.district.toLowerCase() === district.toLowerCase();
        const matchesType = !type || sc.type === type;
        return matchesDist && matchesType;
      });
    }

    res.json({
      success: true,
      count: results.length,
      skill_centers: results
    });
  } catch (err) {
    res.json({
      success: true,
      count: masterSkillCenters.length,
      skill_centers: masterSkillCenters
    });
  }
});

// 10. Government Schemes
router.get('/schemes', async (req, res) => {
  try {
    await connectToDatabase();
    let results = await Scheme.find().lean();
    if (!results || results.length === 0) results = masterSchemes;
    res.json({
      success: true,
      count: results.length,
      schemes: results
    });
  } catch (err) {
    res.json({
      success: true,
      count: masterSchemes.length,
      schemes: masterSchemes
    });
  }
});

// 11. District Reference Profiles
router.get('/districts', async (req, res) => {
  try {
    await connectToDatabase();
    let results = await DistrictInfo.find().lean();
    if (!results || results.length === 0) results = masterDistricts;
    res.json({
      success: true,
      count: results.length,
      districts: results
    });
  } catch (err) {
    res.json({
      success: true,
      count: masterDistricts.length,
      districts: masterDistricts
    });
  }
});

module.exports = router;
