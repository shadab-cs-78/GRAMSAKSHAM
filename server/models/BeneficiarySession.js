const mongoose = require('mongoose');

const BeneficiarySessionSchema = new mongoose.Schema({
  reference_id: { type: String, required: true, unique: true },
  name: { type: String, default: 'लाभार्थी (Beneficiary)' },
  phone: { type: String },
  district: { type: String, default: 'Jabalpur' },
  village_or_location: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  education: { type: String, default: 'secondary' },
  skills: { type: String },
  interests: [{ type: String }],
  employment_preference: { type: String, default: 'self' },
  recommended_trade: { type: String },
  selected_opportunity: { type: Object },
  recommendations: [{ type: Object }],
  status: { type: String, default: 'REGISTERED' }, // REGISTERED, ENROLLED, SUBSIDY_APPLIED, COMPLETED
  feedback: { type: String, default: 'helpful' },
  channel: { type: String, enum: ['KIOSK', 'IVR_PHONE'], default: 'KIOSK' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.BeneficiarySession || mongoose.model('BeneficiarySession', BeneficiarySessionSchema);
