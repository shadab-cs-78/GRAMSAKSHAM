/**
 * Comprehensive Database Seed Script for Gram Saksham
 * Connects to MongoDB Atlas and seeds:
 * 1. Opportunities (Training Courses, City Jobs, Self-Employment Business, PM-AJAY Grants)
 * 2. Skill Centers (PMKKs, KVKs, RSETIs, Industry Clusters)
 * 3. Government Schemes (PMKVY, Namo Drone Didi, PM-KUSUM, PM Vishwakarma, PMFME, Lakhpati Didi)
 * 4. District Info (All MP Districts)
 * 5. PCA SC Census Records (421 records across Ratlam, Rewa, Morena, Shahdol, Jabalpur)
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Opportunity = require('../models/Opportunity');
const SkillCenter = require('../models/SkillCenter');
const Scheme = require('../models/Scheme');
const DistrictInfo = require('../models/DistrictInfo');
const DistrictCensus = require('../models/DistrictCensus');
const PerspectiveBatch = require('../models/PerspectiveBatch');

const opportunitiesData = require('../data/master_opportunities.json');
const skillCentersData = require('../data/master_skill_centers.json');
const schemesData = require('../data/master_schemes.json');
const districtsData = require('../data/master_districts.json');

async function seedAll() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in environment!');
    process.exit(1);
  }

  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('[Seed] Connected successfully.');

    // 1. Opportunities
    console.log('[Seed] Seeding Opportunities (Training, City Jobs, Business, Grants)...');
    await Opportunity.deleteMany({});
    const oppRes = await Opportunity.insertMany(opportunitiesData);
    console.log(`[Seed] Inserted ${oppRes.length} opportunities.`);

    // 2. Skill Centers
    console.log('[Seed] Seeding Skill Centers...');
    await SkillCenter.deleteMany({});
    const scRes = await SkillCenter.insertMany(skillCentersData);
    console.log(`[Seed] Inserted ${scRes.length} skill centers.`);

    // 3. Schemes
    console.log('[Seed] Seeding Government Schemes...');
    await Scheme.deleteMany({});
    const schRes = await Scheme.insertMany(schemesData);
    console.log(`[Seed] Inserted ${schRes.length} government schemes.`);

    // 4. Districts
    console.log('[Seed] Seeding District Profiles...');
    await DistrictInfo.deleteMany({});
    const distRes = await DistrictInfo.insertMany(districtsData);
    console.log(`[Seed] Inserted ${distRes.length} districts.`);

    // 5. PCA SC Census (if not already seeded)
    const censusCount = await DistrictCensus.countDocuments();
    console.log(`[Seed] Current District Census count: ${censusCount}`);
    if (censusCount < 400) {
      console.log('[Seed] Re-seeding PCA SC Census records...');
      const censusFile = path.join(__dirname, '../data/master_census_records.json');
      if (fs.existsSync(censusFile)) {
        const censusDocs = JSON.parse(fs.readFileSync(censusFile, 'utf8'));
        await DistrictCensus.deleteMany({});
        await DistrictCensus.insertMany(censusDocs);
        console.log(`[Seed] Inserted ${censusDocs.length} PCA SC Census records.`);
      }
    }

    // 6. Perspective Batches
    const batchCount = await PerspectiveBatch.countDocuments();
    if (batchCount === 0) {
      await PerspectiveBatch.insertMany([
        {
          batch_id: "BATCH-2026-ELEC-01",
          trade_name: "इलेक्ट्रीशियन (ITI)",
          sector: "Electronics & Hardware",
          district: "Jabalpur",
          block: "Kundam",
          target_size: 30,
          current_enrolled: 18,
          lead_bank: "Punjab National Bank (PNB)",
          financial_mentor: "श्री अमित वर्मा (Lead District Manager, PNB)",
          status: "MOBILIZATION",
          sanctioned_grant_amount: 900000
        },
        {
          batch_id: "BATCH-2026-TAILOR-02",
          trade_name: "सिलाई मशीन ऑपरेटर एवं बुटीक",
          sector: "Apparel & Garment",
          district: "Ratlam",
          block: "Jaora",
          target_size: 30,
          current_enrolled: 24,
          lead_bank: "State Bank of India (SBI)",
          financial_mentor: "श्रीमती रेखा पाटीदार (Lead District Manager, SBI)",
          status: "TRAINING_IN_PROGRESS",
          sanctioned_grant_amount: 1200000
        }
      ]);
      console.log('[Seed] Seeded initial perspective batches.');
    }

    console.log('✅ ALL DATABASE COLLECTIONS SEEDED SUCCESSFULLY INTO MONGODB ATLAS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seedAll();
