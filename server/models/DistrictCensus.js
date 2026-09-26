const mongoose = require('mongoose');

const DistrictCensusSchema = new mongoose.Schema({
  district_name: { type: String, required: true },
  district_code: { type: Number, required: true },
  state_code: { type: Number, default: 23 }, // Madhya Pradesh
  table_name: { type: String, default: 'PCA_STATE_DISTT_SC' },
  division: { type: String },
  sub_division: { type: String },
  group: { type: String },
  family: { type: String },
  nco_name: { type: String, required: true },
  total_persons: { type: Number, default: 0 },
  total_males: { type: Number, default: 0 },
  total_females: { type: Number, default: 0 },
  rural_persons: { type: Number, default: 0 },
  rural_males: { type: Number, default: 0 },
  rural_females: { type: Number, default: 0 },
  urban_persons: { type: Number, default: 0 },
  urban_males: { type: Number, default: 0 },
  urban_females: { type: Number, default: 0 },
  job_category: [{ type: String }],
  interest_areas: [{ type: String }],
  record_type: { type: String, default: 'source_mapped' },
  dummy_id: { type: String },
  source: { type: String, default: 'pca_state_distt_sc.xls' },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.DistrictCensus || mongoose.model('DistrictCensus', DistrictCensusSchema);

