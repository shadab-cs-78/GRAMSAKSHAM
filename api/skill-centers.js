/**
 * Vercel Serverless Function: GET /api/skill-centers
 * Returns PMKKs, KVKs, RSETIs, and Industry Clusters.
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const SkillCenter = require('../server/models/SkillCenter');
const masterSkillCenters = require('../server/data/master_skill_centers.json');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { district, type } = req.query || {};
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

    return res.status(200).json({
      success: true,
      count: results.length,
      skill_centers: results
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: masterSkillCenters.length,
      skill_centers: masterSkillCenters
    });
  }
};
