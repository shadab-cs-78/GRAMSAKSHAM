const mongoose = require('mongoose');

const SkillCenterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  name_hi: { type: String },
  type: { type: String, required: true }, // pmkk, kvk, rseti, cluster, green, iti
  type_label: { type: String },
  district: { type: String, required: true },
  state: { type: String, default: 'Madhya Pradesh' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: { type: String },
  active_courses: [{ type: String }],
  contact: { type: String },
  phone: { type: String },
  seats_available: { type: Number, default: 30 },
  stipend_provided: { type: Boolean, default: true },
  stipend: { type: String },
  batch_starts: { type: String, default: 'Immediate' },
  boarding: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.SkillCenter || mongoose.model('SkillCenter', SkillCenterSchema);
