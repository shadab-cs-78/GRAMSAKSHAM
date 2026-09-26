/**
 * Vercel Serverless Function: GET /api/opportunities
 * Returns catalog of training courses, city jobs, self-employment business units, and grants.
 */

const { connectToDatabase } = require('../server/lib/mongodb');
const Opportunity = require('../server/models/Opportunity');
const masterOpportunities = require('../server/data/master_opportunities.json');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { category, district } = req.query || {};
    await connectToDatabase();

    let query = {};
    if (category) query.category = category;
    if (district) query.districts = { $in: [new RegExp(district, 'i')] };

    let results = await Opportunity.find(query).lean();
    if (!results || results.length === 0) {
      results = masterOpportunities.filter(item => {
        const matchesCat = !category || item.category === category;
        const matchesDist = !district || (item.districts && item.districts.some(d => d.toLowerCase() === district.toLowerCase()));
        return matchesCat && matchesDist;
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      opportunities: results
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: masterOpportunities.length,
      opportunities: masterOpportunities
    });
  }
};
