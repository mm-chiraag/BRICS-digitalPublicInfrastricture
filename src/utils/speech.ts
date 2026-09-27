// High-Definition Regional Speech Engine with Server-Side Audio Streaming & Local Synthesis Fallback

import { OFFICIAL_REGIONAL_LANGUAGES } from '../data/initialComplaints';
import { RegionalLanguage, Complaint } from '../types';

let currentAudio: HTMLAudioElement | null = null;

export function getLocalizedCity(city: string, lang: RegionalLanguage): string {
  if (!city) return 'Local District';
  const c = city.toLowerCase();

  const cityMap: Record<string, Partial<Record<RegionalLanguage, string>>> = {
    bengaluru: { hi: 'बेंगलुरु', ru: 'Бенгалуру', zh: '班加罗尔' },
    mumbai: { hi: 'मुंबई', ru: 'Мумбаи', zh: '孟买' },
    kolkata: { hi: 'कोलकाता', ru: 'Калькутта', zh: '加尔各答' },
    chennai: { hi: 'चेन्नई', ru: 'Ченнаи', zh: '金奈' },
    hyderabad: { hi: 'हैदराबाद', ru: 'Хайдерабад', zh: '海得拉巴' },
    ahmedabad: { hi: 'अहमदाबाद', ru: 'Ахмадабад', zh: '阿姆利则' },
    noida: { hi: 'नोएडा', ru: 'Ноида', zh: '诺伊达' },
    moscow: { hi: 'मॉस्को', ru: 'Москва', zh: '莫斯科' }
  };

  for (const [key, map] of Object.entries(cityMap)) {
    if (c.includes(key)) {
      if (map[lang]) return map[lang]!;
      if (map.hi) return map.hi!;
    }
  }
  return city;
}

export function getLocalizedDept(dept: string, lang: RegionalLanguage): string {
  if (!dept) return 'Public Works Dept';
  const d = dept.toLowerCase();

  const deptMap: Record<string, Partial<Record<RegionalLanguage, string>>> = {
    nhai: {
      hi: 'राष्ट्रीय राजमार्ग एवं पुल प्राधिकरण',
      ru: 'Департамент автодорог и мостов',
      zh: '国家公路与桥梁管理局'
    },
    jal: {
      hi: 'जल बोर्ड एवं पेयजल आपूर्ति विभाग',
      ru: 'Департамент водоснабжения',
      zh: '水务与供水局'
    },
    electricity: {
      hi: 'विद्युत वितरण एवं पावर ग्रिड निगम',
      ru: 'Департамент электросетей',
      zh: '国家电力局'
    },
    cpwd: {
      hi: 'केंद्रीय लोक निर्माण विभाग',
      ru: 'Департамент общественных работ',
      zh: '公共工程部'
    },
    metro: {
      hi: 'मेट्रो एवं मास ट्रांजिट कॉर्पोरेशन',
      ru: 'Департамент метро и транспорта',
      zh: '轨道交通局'
    },
    health: {
      hi: 'स्वास्थ्य एवं अस्पताल बुनियादी ढांचा',
      ru: 'Департамент здравоохранения',
      zh: '卫生与医疗局'
    }
  };

  for (const [key, map] of Object.entries(deptMap)) {
    if (d.includes(key)) {
      if (map[lang]) return map[lang]!;
      if (map.hi) return map.hi!;
    }
  }
  return dept;
}

export function generateRegionalComplaintAudioText(
  complaint: Complaint,
  langCode: RegionalLanguage,
  rankNumber?: number
): string {
  const city = getLocalizedCity(complaint.location.city || 'Local Region', langCode);
  const callers = complaint.complaintCount || 1;
  const budget = complaint.costEstimate?.amountLocalCurrency || `$${complaint.costEstimate?.amountUSD?.toLocaleString() || 50000} USD`;
  const rank = rankNumber || complaint.priorityRank || 1;
  const dept = getLocalizedDept(complaint.assignedDepartment || 'Public Works', langCode);
  const transcriptText = complaint.voiceTranscript || complaint.title || 'Public Infrastructure Issue';

  switch (langCode) {
    case 'hi':
      return `सरकारी शिकायत रिपोर्ट रैंक ${rank}। स्थान: ${city}। 1930 हेल्पलाइन पर कॉल करने वाले नागरिक: ${callers}। विवरण: ${transcriptText}। स्वीकृत बजट: ${budget}। जिम्मेदार विभाग: ${dept}।`;
    case 'zh':
      return `官方公共投诉报告 排名 ${rank}，城市: ${city}。1930 呼叫公民: ${callers}人。详情: ${transcriptText}。批准的预算: ${budget}。负责部门: ${dept}。`;
    case 'ru':
      return `Официальный отчет о жалобе Ранг ${rank}, Город: ${city}. Вызовов на 1930: ${callers}. Подробности: ${transcriptText}. Утвержденный бюджет: ${budget}. Департамент: ${dept}.`;
    case 'pt':
      return `Relatório Oficial de Reclamação Categoria ${rank}, Cidade: ${city}. Chamadas no 1930: ${callers}. Detalhes: ${transcriptText}. Orçamento Aprovado: ${budget}.`;
    case 'am':
      return `የመንግስት የቅሬታ ሪፖርት ደረጃ ${rank}፣ ቦታ፡ ${city}። በ1930 የደወሉ ዜጎች፡ ${callers}። ዝርዝር፡ ${transcriptText}። የፀደቀ በጀት፡ ${budget}።`;
    case 'zu':
      return `Umbiko Osemthethweni Wesikhalazo Sezakhamuzi Rank ${rank}, Indawo: ${city}. Abashayele u-1930: ${callers}. Isobho Langesikhathi: ${budget}.`;
    default:
      return `Official Public Grievance Report Rank ${rank} in ${city}. Total callers on 1930 helpline: ${callers}. Details: ${transcriptText}. Approved civil budget: ${budget}. Assigned Department: ${dept}.`;
  }
}

export function generateSanctionNoticeAudioText(
  complaint: Complaint,
  langCode: RegionalLanguage
): string {
  const city = getLocalizedCity(complaint.location.city || 'Local Region', langCode);
  const budget = complaint.costEstimate?.amountLocalCurrency || `$${complaint.costEstimate?.amountUSD?.toLocaleString() || 50000} USD`;
  const days = complaint.costEstimate?.completionTimeDays || 5;
  const dept = getLocalizedDept(complaint.assignedDepartment || 'Public Works', langCode);
  const transcriptText = complaint.voiceTranscript || complaint.title || 'Public Infrastructure Issue';

  switch (langCode) {
    case 'hi':
      return `सरकारी मंजूरी सूचना: ${city} क्षेत्र में ${transcriptText} कार्य को आधिकारिक रूप से स्वीकृत कर दिया गया है। स्वीकृत बजट: ${budget}। जिम्मेदार विभाग: ${dept}। लक्षित कार्य समय: ${days} दिन। सिविल इंजीनियर मौके पर तैनात हैं।`;
    case 'zh':
      return `官方批准通知: ${city} 的 ${transcriptText} 工程已获批准。批准预算: ${budget}。完成时间: ${days} 天。`;
    case 'ru':
      return `Официальное уведомление о санкционировании: Работы по ${transcriptText} в ${city} утверждены. Бюджет: ${budget}.`;
    case 'pt':
      return `Aviso Oficial de Aprovação: Trabalho para ${transcriptText} em ${city} aprovado. Orçamento: ${budget}.`;
    default:
      return `Official Government Sanction Notice for ${city}. Issue: ${transcriptText}. Work Order Approved. Sanctioned Budget: ${budget}. Assigned Department: ${dept}. Target completion time: ${days} days. Engineering crews and machinery deployed on site.`;
  }
}

export function stopRegionalText() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakRegionalText(
  text: string,
  langCode: RegionalLanguage,
  onStart?: () => void,
  onEnd?: () => void
) {
  stopRegionalText();

  const langMap: Record<string, string> = {
    hi: 'hi',
    zh: 'zh-CN',
    ru: 'ru',
    pt: 'pt',
    am: 'am',
    zu: 'en',
    en: 'en'
  };

  const ttsLang = langMap[langCode] || 'hi';
  const audioUrl = `/api/tts?text=${encodeURIComponent(text.slice(0, 300))}&lang=${ttsLang}`;

  try {
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      console.warn('Backend audio streaming fallback to SpeechSynthesis API...');
      currentAudio = null;
      fallbackSpeechSynthesis(text, langCode, onStart, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play exception, trying fallback SpeechSynthesis:', err);
        fallbackSpeechSynthesis(text, langCode, onStart, onEnd);
      });
    }
  } catch (e) {
    fallbackSpeechSynthesis(text, langCode, onStart, onEnd);
  }
}

function fallbackSpeechSynthesis(
  text: string,
  langCode: RegionalLanguage,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const matchedLang = OFFICIAL_REGIONAL_LANGUAGES.find((l) => l.code === langCode);
  const speechLangCode = matchedLang?.speechCode || 'hi-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLangCode;
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const match =
      voices.find((v) => v.lang === speechLangCode) ||
      voices.find((v) => v.lang.startsWith(langCode)) ||
      voices.find((v) => v.lang.toLowerCase().includes(langCode.toLowerCase()));

    if (match) {
      utterance.voice = match;
    }
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
