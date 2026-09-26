const tradesData = require('../data/master_opportunities.json');

const EDU_RANKS = {
  'no_formal': 0,
  'primary': 1,
  'secondary': 2,
  'higher_secondary': 3,
  'diploma': 3,
  'graduate': 4,
  'other': 1
};

const MIN_EDU_REQ = {
  'none': 0,
  'no_formal': 0,
  'primary': 1,
  '5th': 1,
  '8th': 2,
  '10th': 2,
  'secondary': 2,
  '12th': 3,
  'higher_secondary': 3
};

function getRecommendations(profile = {}) {
  const {
    education = 'secondary',
    skills = 'farming',
    interests = ['electrician'],
    location = 'village',
    employment_preference = 'self',
    district = 'Jabalpur',
    locationName = ''
  } = profile;

  const userEduRank = EDU_RANKS[education] !== undefined ? EDU_RANKS[education] : 2;
  const userDistrict = (district || locationName || 'Jabalpur').toLowerCase();

  const scored = tradesData.map(trade => {
    let score = 50; // base score
    let matchReasons = [];

    // 1. District Match Bonus (Highest priority for local livelihood)
    if (trade.districts && trade.districts.some(d => userDistrict.includes(d.toLowerCase()) || d.toLowerCase().includes(userDistrict))) {
      score += 35;
      matchReasons.push(`आपके जिले / क्षेत्र में उपलब्ध अवसर`);
    }

    // 2. Education Match
    const reqRank = MIN_EDU_REQ[trade.min_education] !== undefined ? MIN_EDU_REQ[trade.min_education] : 2;
    if (userEduRank >= reqRank) {
      score += 20;
      matchReasons.push("आपकी शिक्षा (Education) इस अवसर के अनुकूल है");
    } else {
      score -= 10;
    }

    // 3. Existing / Traditional Skills Match (Recognition of Prior Learning - RPL)
    if (skills === 'tailoring' && (trade.id.includes('TAILOR') || trade.sector?.includes('Apparel') || trade.sector?.includes('Handicrafts'))) {
      score += 30;
      matchReasons.push("पारंपरिक सिलाई व हथकरघा हुनर का RPL उन्नयन एवं सरकारी उपकरण अनुदान");
    } else if (skills === 'farming' && (trade.id.includes('AGRI') || trade.id.includes('DRONE') || trade.id.includes('DAIRY') || trade.id.includes('AQUA') || trade.sector?.includes('Agriculture'))) {
      score += 30;
      matchReasons.push("पारंपरिक कृषि एवं पशुपालन पृष्ठभूमि का आधुनिक तकनीक में रूपांतरण");
    } else if (skills === 'carpentry_metal' && (trade.id.includes('ELEC') || trade.id.includes('SOLAR'))) {
      score += 25;
      matchReasons.push("आपके तकनीकी कार्य अनुभव (Skills) का प्रत्यक्ष उपयोग");
    }

    // 4. New Interests Match
    const tradeText = (trade.title_hi + " " + trade.title_en + " " + (trade.sector || '') + " " + trade.id).toLowerCase();
    let interestMatched = false;
    const interestArr = Array.isArray(interests) ? interests : [interests];
    
    interestArr.forEach(interest => {
      const query = (interest || '').toLowerCase();
      if (tradeText.includes(query) || 
         (query.includes('electric') && (trade.id.includes('ELEC') || tradeText.includes('electric'))) ||
         (query.includes('mobile') && (trade.id.includes('MOB') || tradeText.includes('mobile'))) ||
         (query.includes('solar') && (trade.id.includes('SOL') || tradeText.includes('solar'))) ||
         (query.includes('food') && (trade.id.includes('FOOD') || tradeText.includes('food'))) ||
         (query.includes('organic') && (trade.id.includes('AGRI') || tradeText.includes('organic'))) ||
         (query.includes('tailor') && (trade.id.includes('TAILOR') || trade.id.includes('HND'))) ||
         (query.includes('drone') && tradeText.includes('drone')) ||
         (query.includes('dairy') && tradeText.includes('dairy')) ||
         (query.includes('fish') && tradeText.includes('fish'))) {
        score += 35;
        interestMatched = true;
      }
    });
    
    if (interestMatched) {
      matchReasons.push("आपकी बताई गई नई रुचि (Interests) के सीधे अनुकूल");
    }

    // 5. Employment Preference Match
    if (employment_preference === 'self') {
      if (trade.category === 'self_employment' || trade.category === 'grant' || trade.employment_type === 'self') {
        score += 30;
        matchReasons.push("स्वरोजगार प्राथमिकता: ₹50,000 PM-AJAY GIA पूंजीगत अनुदान पात्र");
      }
    } else if (employment_preference === 'wage') {
      if (trade.category === 'job' || trade.employment_type === 'wage') {
        score += 30;
        matchReasons.push("वेतनभोगी रोजगार: नियमित मासिक वेतन एवं कंपनी सुविधाएं");
      }
    } else {
      score += 20;
    }

    if (matchReasons.length === 0) {
      matchReasons = trade.suitable_for || ["MoSJE PM-AJAY योजनांतर्गत सत्यापित अवसर"];
    }

    return {
      ...trade,
      score,
      match_reasons: matchReasons
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

module.exports = { getRecommendations, tradesData };
