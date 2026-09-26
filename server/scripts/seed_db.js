/**
 * Database Seed Script for Gram Saksham
 * Seeds:
 * 1. NSQF Training Courses, Job Opportunities, Self-Employment, and PM-AJAY GIA Grants
 * 2. Real PCA Scheduled Caste Census Datasets for Shahdol, Ratlam, Morena, and Jabalpur
 * 3. 30-Member Standard Cohorts for MoSJE Perspective Planning
 */

require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config/keys');
const Opportunity = require('../models/Opportunity');
const DistrictCensus = require('../models/DistrictCensus');
const PerspectiveBatch = require('../models/PerspectiveBatch');
const BeneficiarySession = require('../models/BeneficiarySession');

const opportunitiesData = require('../data/master_opportunities.json');
const censusData = require('../data/census_sc_data.json');

async function seedDatabase() {
  const uri = config.MONGODB_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.log('[Seed] No MONGODB_URI set. Local JSON store is already prepared for in-memory execution.');
    return;
  }

  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('[Seed] Connected successfully.');

    // 1. Seed Opportunities
    console.log('[Seed] Seeding Opportunities (Training, Jobs, Self-Employment, Grants)...');
    await Opportunity.deleteMany({});
    await Opportunity.insertMany(opportunitiesData);
    console.log(`[Seed] Inserted ${opportunitiesData.length} opportunities successfully.`);

    // 2. Seed District Census Data
    console.log('[Seed] Seeding PCA SC Census Data for Ratlam, Rewa, Morena, Shahdol, Jabalpur...');
    await DistrictCensus.deleteMany({});
    
    let censusDocs = [];
    const masterCensusPath = path.join(__dirname, '../data/master_census_records.json');
    if (fs.existsSync(masterCensusPath)) {
      censusDocs = JSON.parse(fs.readFileSync(masterCensusPath, 'utf-8'));
    } else {
      censusData.districts.forEach(dist => {
        dist.key_occupations.forEach(occ => {
          censusDocs.push({
            district_name: dist.district_name,
            district_code: dist.district_code,
            state_code: dist.state_code,
            nco_name: occ.name,
            total_persons: occ.count,
            rural_persons: occ.count,
            job_category: [occ.category],
            interest_areas: [occ.sector],
            source: 'pca_state_distt_sc.xls'
          });
        });
      });
    }

    await DistrictCensus.insertMany(censusDocs);
    console.log(`[Seed] Inserted ${censusDocs.length} complete census occupation records.`);

    // 3. Seed Perspective Batches
    console.log('[Seed] Seeding Initial 30-Member Perspective Batches for MoSJE Dashboard...');
    await PerspectiveBatch.deleteMany({});
    const initialBatches = [
      {
        batch_id: "BATCH-JBP-ELEC-01",
        district: "Jabalpur",
        trade: "इलेक्ट्रीशियन (ITI - NSQF Level 4)",
        sector: "Electronics & Hardware",
        target_candidates: 30,
        enrolled_candidates: 30,
        center: "Govt ITI जबलपुर",
        financial_mentor: "श्री अमित वर्मा (Lead Bank Officer - PNB)",
        status: "प्रशिक्षण जारी (In Progress)",
        placement_partner: "MPPKVVCL / स्थानीय कांट्रेक्टर"
      },
      {
        batch_id: "BATCH-MOR-AGRI-02",
        district: "Morena",
        trade: "डेयरी एवं पशु आहार मूल्य संवर्धन (NSQF 3)",
        sector: "Agriculture & Dairy",
        target_candidates: 30,
        enrolled_candidates: 28,
        center: "RSETI मुरैना",
        financial_mentor: "श्रीमती रेखा पटेल (Lead Bank Officer / Bank Mitra)",
        status: "बैच पूर्ण - टूलकिट वितरण (Toolkit Stage)",
        placement_partner: "जिला उद्योग केंद्र SHG फेडरेशन"
      },
      {
        batch_id: "BATCH-SHD-DIGI-03",
        district: "Shahdol",
        trade: "डिजिटल सेवा केंद्र (CSC) सहायक (NSQF 4)",
        sector: "IT & E-Services",
        target_candidates: 30,
        enrolled_candidates: 24,
        center: "PMKK कौशल केंद्र शहडोल",
        financial_mentor: "श्री आर. के. तिवारी (नाबार्ड प्रतिनिधि)",
        status: "प्रवेश प्रक्रिया (Enrollment Open)",
        placement_partner: "CSC e-Governance Services"
      }
    ];
    await PerspectiveBatch.insertMany(initialBatches);
    console.log(`[Seed] Inserted ${initialBatches.length} perspective planning batches.`);

    console.log('\n=============================================');
    console.log('🎉 MongoDB Database Seeding Completed 100%!');
    console.log('=============================================\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
