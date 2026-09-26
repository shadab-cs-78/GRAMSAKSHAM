const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title_hi: { type: String, required: true },
  title_en: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['training', 'job', 'self_employment', 'grant'], 
    default: 'training' 
  },
  nsqf_level: { type: Number, default: 4 },
  duration: { type: String, default: '3 महीने' },
  sector: { type: String, required: true },
  min_education: { type: String, default: 'secondary' },
  districts: [{ type: String }],
  coordinates: {
    lat: { type: Number, default: 23.1815 },
    lng: { type: Number, default: 79.9650 }
  },
  institute: {
    name_hi: { type: String },
    name_en: { type: String },
    distance_km: { type: Number, default: 5 },
    contact: { type: String },
    address: { type: String }
  },
  employment_type: { 
    type: String, 
    enum: ['self', 'wage', 'both'], 
    default: 'both' 
  },
  pm_ajay_benefits: {
    capital_subsidy: { type: String, default: '₹50,000 पूंजीगत अनुदान' },
    stipend: { type: String, default: '₹1,500 प्रतिमाह भत्ता' },
    toolkit: { type: String, default: 'मुफ्त टूलकिट किट' }
  },
  suitable_for: [{ type: String }],
  image_type: { type: String, default: 'electrician' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Opportunity || mongoose.model('Opportunity', OpportunitySchema);
