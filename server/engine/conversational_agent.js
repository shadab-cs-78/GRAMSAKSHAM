/**
 * Conversational state manager for Gram Saksham Kiosk & IVR
 */

const DIALOGUE_STEPS = {
  WELCOME: 'WELCOME',
  EDUCATION: 'EDUCATION',
  TRADITIONAL_WORK: 'TRADITIONAL_WORK',
  INTERESTS: 'INTERESTS',
  EMPLOYMENT_PREFERENCE: 'EMPLOYMENT_PREFERENCE',
  PROCESSING: 'PROCESSING',
  RECOMMENDATIONS: 'RECOMMENDATIONS'
};

function processUserSpeech(speechText, currentStep = 'EDUCATION', currentProfile = {}) {
  const text = (speechText || '').toLowerCase().trim();
  const profile = { ...currentProfile };
  let nextStep = currentStep;
  let replyText = "";
  let extractedField = null;

  if (currentStep === 'EDUCATION') {
    if (text.includes('नहीं') || text.includes('no formal') || text.includes('अनपढ़') || text.includes('स्कूल नहीं')) {
      profile.education = 'no_formal';
      extractedField = { education: 'no_formal', label: 'स्कूल नहीं गया' };
    } else if (text.includes('पाँच') || text.includes('5') || text.includes('प्राथमिक') || text.includes('primary')) {
      profile.education = 'primary';
      extractedField = { education: 'primary', label: 'प्राथमिक (1-5)' };
    } else if (text.includes('दस') || text.includes('10') || text.includes('माध्यमिक') || text.includes('मैट्रिक') || text.includes('secondary')) {
      profile.education = 'secondary';
      extractedField = { education: 'secondary', label: 'माध्यमिक (6-10)' };
    } else if (text.includes('बारह') || text.includes('12') || text.includes('इंटर') || text.includes('higher')) {
      profile.education = 'higher_secondary';
      extractedField = { education: 'higher_secondary', label: 'उच्च माध्यमिक (11-12)' };
    } else if (text.includes('डिप्लोमा') || text.includes('iti') || text.includes('आईटीआई')) {
      profile.education = 'diploma';
      extractedField = { education: 'diploma', label: 'डिप्लोमा / ITI' };
    } else if (text.includes('कॉलेज') || text.includes('ग्रेजुएट') || text.includes('बीए') || text.includes('graduate')) {
      profile.education = 'graduate';
      extractedField = { education: 'graduate', label: 'स्नातक' };
    } else {
      profile.education = 'secondary'; // reasonable default
      extractedField = { education: 'secondary', label: 'माध्यमिक (6-10)' };
    }

    nextStep = 'INTERESTS';
    replyText = "धन्यवाद! अब मुझे बताएं कि आपकी किस काम या हुनर में सबसे ज्यादा रुचि है? जैसे बिजली का काम, मोबाइल रिपेयरिंग, खेती या सिलाई?";
  } 
  else if (currentStep === 'INTERESTS') {
    profile.interests = [];
    if (text.includes('बिजली') || text.includes('लाइट') || text.includes('electric') || text.includes('तार')) {
      profile.interests.push('electric', 'इलेक्ट्रीशियन');
    }
    if (text.includes('मोबाइल') || text.includes('फोन') || text.includes('mobile')) {
      profile.interests.push('mobile', 'रिपेयरिंग');
    }
    if (text.includes('सोलर') || text.includes('धूप') || text.includes('solar')) {
      profile.interests.push('solar', 'सौर');
    }
    if (text.includes('खेती') || text.includes('फसल') || text.includes('मशरूम') || text.includes('agri')) {
      profile.interests.push('agri', 'कृषि', 'मशरूम');
    }
    if (text.includes('सिलाई') || text.includes('कपड़ा') || text.includes('दर्जी') || text.includes('tailor')) {
      profile.interests.push('tailor', 'सिलाई');
    }

    if (profile.interests.length === 0) {
      profile.interests = ['electric', 'mobile'];
    }

    nextStep = 'PROCESSING';
    replyText = "बहुत बढ़िया! मैं आपकी योग्यता और रुचि के आधार पर आपके नजदीकी NSQF प्रशिक्षण और पीएम-अजय योजनाओं का मिलान कर रही हूँ।";
  }

  return {
    nextStep,
    profile,
    extractedField,
    replyText
  };
}

module.exports = { DIALOGUE_STEPS, processUserSpeech };
