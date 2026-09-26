const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  title_hi: { type: String },
  title_mr: { type: String },
  ministry: { type: String, required: true },
  badge: { type: String },
  badge_color: { type: String, default: 'emerald' },
  official_portal: { type: String },
  eligibility: { type: String },
  key_benefits: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Scheme || mongoose.model('Scheme', SchemeSchema);
