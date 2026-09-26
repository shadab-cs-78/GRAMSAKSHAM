/**
 * Vercel Serverless Function: /api/ivr
 * Handles IVR telephone simulation and Twilio webhook endpoints.
 */

const IVR_SCRIPT = {
  1: {
    prompt_hi: "नमस्ते! ग्राम सक्षम हेल्पलाइन में आपका स्वागत है। प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) के तहत कौशल प्रशिक्षण और ₹50,000 अनुदान की जानकारी के लिए कृपया अपनी शिक्षा बताएं। अनपढ़ के लिए 1 दबाएं, 5वीं या 8वीं के लिए 2 दबाएं, 10वीं के लिए 3 दबाएं, 12वीं या कॉलेज के लिए 4 दबाएं।",
    prompt_en: "Welcome to Gram Saksham Helpline for PM-AJAY. For education: Press 1 for No Formal Education, 2 for 5th/8th pass, 3 for 10th pass, 4 for 12th/Graduate.",
    next: 2
  },
  2: {
    prompt_hi: "धन्यवाद। अब बताइए कि आप क्या काम सीखना चाहते हैं? बिजली और सोलर के लिए 1 दबाएं, मोबाइल रिपेयरिंग के लिए 2 दबाएं, सिलाई और बुटीक के लिए 3 दबाएं, या खेती और मशरूम के लिए 4 दबाएं।",
    prompt_en: "What skill do you want to learn? Press 1 for Electrician & Solar, 2 for Mobile Repairing, 3 for Tailoring, 4 for Agriculture.",
    next: 3
  },
  3: {
    prompt_hi: "क्या आप खुद की दुकान या व्यवसाय खोलना चाहते हैं, या किसी कंपनी में नौकरी करना चाहते हैं? खुद के व्यवसाय और 50,000 रुपये अनुदान के लिए 1 दबाएं, नौकरी के लिए 2 दबाएं।",
    prompt_en: "Press 1 for Self-Employment & Capital Subsidy, Press 2 for Job Placement.",
    next: 4
  },
  4: {
    prompt_hi: "बधाई हो! आपकी योग्यता के आधार पर आपके निकटतम आईटीआई केंद्र में इलेक्ट्रीशियन (NSQF Level 4) प्रशिक्षण और ₹50,000 टूलकिट अनुदान स्वीकृत है। आपके मोबाइल नंबर पर एसएमएस भेज दिया गया है। ग्राम सक्षम से जुड़ने के लिए धन्यवाद।",
    prompt_en: "Congratulations! You are matched with Electrician (NSQF Level 4) with ₹50,000 toolkit subsidy. Details sent via SMS. Thank you!",
    next: null
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { step = 1, digit = null } = req.body || {};
  const current = IVR_SCRIPT[step] || IVR_SCRIPT[1];

  return res.status(200).json({
    step,
    next_step: current.next,
    prompt_hi: current.prompt_hi,
    prompt_en: current.prompt_en,
    is_completed: current.next === null
  });
};
