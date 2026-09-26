/**
 * Vercel Serverless Function: GET /api/census
 * Returns PCA Scheduled Caste demographic occupation data for Shahdol, Ratlam, Morena, Jabalpur.
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const DistrictCensus = require('../server/models/DistrictCensus');
const censusData = require('../server/data/census_sc_data.json');

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
      records = await DistrictCensus.find({}).lean();
    }

    return res.status(200).json({
      success: true,
      source: "pca_state_distt_sc.xls",
      districts_covered: censusData.districts,
      database_records_count: records.length,
      note: "Census SC rural occupation mappings for MoSJE PM-AJAY GIA demand analysis."
    });
  } catch (error) {
    console.error('[API Error /census]:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
