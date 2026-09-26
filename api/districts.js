/**
 * Vercel Serverless Function: GET /api/districts
 * Returns reference profiles for target districts (Shahdol, Ratlam, Morena, Rewa, Jabalpur).
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const DistrictInfo = require('../server/models/DistrictInfo');
const masterDistricts = require('../server/data/master_districts.json');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();
    let results = await DistrictInfo.find().lean();
    if (!results || results.length === 0) results = masterDistricts;

    return res.status(200).json({
      success: true,
      count: results.length,
      districts: results
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: masterDistricts.length,
      districts: masterDistricts
    });
  }
};
