/**
 * Vercel Serverless Function: GET /api/perspective-plan
 * Aggregates MoSJE Perspective Planning data, 30-member cohorts, and AAP statistics.
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const PerspectiveBatch = require('../server/models/PerspectiveBatch');
const censusData = require('../server/data/census_sc_data.json');

const defaultBatches = [
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
    financial_mentor: "श्रीमती रेखा पटेल (LBO / Bank Mitra)",
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
    let batches = [];

    if (conn) {
      batches = await PerspectiveBatch.find({}).lean();
    }

    if (!batches || batches.length === 0) {
      batches = defaultBatches;
    }

    return res.status(200).json({
      success: true,
      district_coverage: ["Jabalpur", "Shahdol", "Ratlam", "Morena"],
      active_districts: censusData.districts,
      sc_population_coverage: "74%",
      active_kiosks: 18,
      ivr_calls_handled: 1240,
      total_screened: 246,
      gia_subsidy_allocated: "₹25,00,000",
      batches_formed: batches
    });
  } catch (error) {
    console.error('[API Error /perspective-plan]:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
