/**
 * Vercel Serverless Function: GET /api/beneficiaries
 * Fetches beneficiary records from MongoDB or local store.
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const BeneficiarySession = require('../server/models/BeneficiarySession');

const defaultMockBeneficiaries = [
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
    channel: "KIOSK",
    createdAt: new Date().toISOString()
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
    channel: "IVR_PHONE",
    createdAt: new Date().toISOString()
  },
  {
    reference_id: "GS20260920-1236",
    name: "दिनेश जाटव (Dinesh Jatav)",
    phone: "9823145678",
    district: "Shahdol",
    village_or_location: "शहडोल ब्लॉक केंद्र",
    education: "10वीं पास",
    interests: ["Digital CSC", "Computer"],
    recommended_trade: "डिजिटल सेवा केंद्र (CSC) सहायक",
    status: "REGISTERED",
    channel: "KIOSK",
    createdAt: new Date().toISOString()
  }
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const conn = await connectToDatabase();
    let records = [];

    if (conn) {
      records = await BeneficiarySession.find({}).sort({ createdAt: -1 }).lean();
    }

    if (!records || records.length === 0) {
      records = [...(global._inMemoryBeneficiaries || []), ...defaultMockBeneficiaries];
    }

    return res.status(200).json({
      success: true,
      total: records.length,
      storage: conn ? 'MONGODB_ATLAS' : 'IN_MEMORY_CACHE',
      beneficiaries: records
    });
  } catch (error) {
    console.error('[API Error /beneficiaries]:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
