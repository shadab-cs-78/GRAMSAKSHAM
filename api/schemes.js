/**
 * Vercel Serverless Function: GET /api/schemes
 * Returns Government Schemes (PMKVY, Namo Drone Didi, PM-KUSUM, PM Vishwakarma, PMFME, Lakhpati Didi).
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const Scheme = require('../server/models/Scheme');
const masterSchemes = require('../server/data/master_schemes.json');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();
    let results = await Scheme.find().lean();
    if (!results || results.length === 0) results = masterSchemes;

    return res.status(200).json({
      success: true,
      count: results.length,
      schemes: results
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: masterSchemes.length,
      schemes: masterSchemes
    });
  }
};
