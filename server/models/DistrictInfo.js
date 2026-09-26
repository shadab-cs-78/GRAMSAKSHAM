const mongoose = require('mongoose');

const DistrictInfoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_hi: { type: String },
  zone: { type: String },
  aspirational: { type: Boolean, default: false },
  rural_pct: { type: Number },
  tribal_pct: { type: Number },
  literacy_pct: { type: Number },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  major_crops: { type: String },
  recommended_skills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.DistrictInfo || mongoose.model('DistrictInfo', DistrictInfoSchema);
