const mongoose = require('mongoose');

const PerspectiveBatchSchema = new mongoose.Schema({
  batch_id: { type: String, required: true, unique: true },
  district: { type: String, default: 'Jabalpur' },
  trade: { type: String, required: true },
  sector: { type: String },
  target_candidates: { type: Number, default: 30 },
  enrolled_candidates: { type: Number, default: 0 },
  center: { type: String, required: true },
  financial_mentor: { type: String }, // Lead Bank Officer (PNB) or Bank Mitra
  status: { type: String, default: 'ENROLLMENT_OPEN' },
  placement_partner: { type: String },
  annual_action_plan_year: { type: String, default: '2026-27' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PerspectiveBatch || mongoose.model('PerspectiveBatch', PerspectiveBatchSchema);
