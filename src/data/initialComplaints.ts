import type { Complaint, LanguageInfo, RegionalLanguage } from '../types';

export const OFFICIAL_REGIONAL_LANGUAGES: LanguageInfo[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India (North / Central)', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / National Standard', flag: '🌐', speechCode: 'en-US' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文', region: 'China', flag: '🇨🇳', speechCode: 'zh-CN' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Russia', flag: '🇷🇺', speechCode: 'ru-RU' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Brazil', flag: '🇧🇷', speechCode: 'pt-BR' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Ethiopia', flag: '🇪🇹' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'South Africa', flag: '🇿🇦' }
];

export const INITIAL_NATIONAL_COMPLAINTS: Complaint[] = [
  {
    id: 'gov-101',
    ticketNumber: 'NDPI-1930-8912',
    citizenName: 'Anand Varma',
    citizenPhone: '+91 98450 11223',
    language: 'hi',
    category: 'Roads & Bridges',
    assignedDepartment: 'NHAI (Highways & Expressways)',
    title: 'Flyover Structural Pillar Cracks & Asphalt Erosion on Outer Ring Road',
    description: 'Over 185 commuters called hotline reporting major concrete beam fissures on the Silk Board - Marathahalli elevated highway corridor, posing structural safety risks during peak traffic hours.',
    location: {
      address: 'Outer Ring Road, Near Ecospace Flyover Pillar #42',
      city: 'Bengaluru',
      stateDistrict: 'Karnataka (Bengaluru Urban)',
      country: 'India',
      pinCode: '560103',
      lat: 12.9279,
      lng: 77.6822
    },
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    severity: 'Critical',
    complaintCount: 185,
    status: 'Pending',
    costEstimate: {
      amountUSD: 165000,
      amountLocalCurrency: '₹1,38,00,000 INR',
      breakdown: {
        materials: 75000,
        labor: 45000,
        equipment: 30000,
        contingency: 15000
      },
      completionTimeDays: 18,
      justification: 'High-strength fiber polymer carbon jacketing of pier cap, epoxy mortar injection, and milling/resurfacing of 2.2km arterial road span.',
      tenderCode: 'NHAI-2026-TND-8841'
    },
    voiceTranscript: 'ನಮಸ್ಕಾರ, ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ಮಾರತ್ತಹಳ್ಳಿ ಮೇಲ್ಸೇತುವೆಯ 42 ನೇ ಕಂಬದಲ್ಲಿ ದೊಡ್ಡ ಬಿರುಕುಗಳು ಕಾಣಿಸಿಕೊಂಡಿವೆ. ತಕ್ಷಣ ದುರಸ್ತಿ ಮಾಡದಿದ್ದರೆ ದೊಡ್ಡ ಅನಾಹುತವಾಗಬಹುದು.'
  },
  {
    id: 'gov-102',
    ticketNumber: 'NDPI-1930-4091',
    citizenName: 'Sunita Deshmukh',
    citizenPhone: '+91 98220 33445',
    language: 'hi',
    category: 'Water & Sanitation',
    assignedDepartment: 'Jal Board (Water & Sewage)',
    title: 'Main Trunk Sewage Burst & Contamination in Urban Densely Populated Zone',
    description: '142 citizen callers reported 900mm primary sewer pipeline fracture causing effluent overflow near local schools and contaminating domestic drinking water supply.',
    location: {
      address: 'LBS Marg, Near Bhandup West Station Road',
      city: 'Mumbai',
      stateDistrict: 'Maharashtra (Mumbai Suburban)',
      country: 'India',
      pinCode: '400078',
      lat: 19.1438,
      lng: 72.9378
    },
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    severity: 'Critical',
    complaintCount: 142,
    status: 'Pending',
    costEstimate: {
      amountUSD: 110000,
      amountLocalCurrency: '₹92,00,000 INR',
      breakdown: {
        materials: 52000,
        labor: 32000,
        equipment: 18000,
        contingency: 8000
      },
      completionTimeDays: 8,
      justification: 'Emergency trenchless pipe lining replacement, jetting unit vacuum clearance, and chlorinated water supply flushing.',
      tenderCode: 'MCGM-WATER-2026-104'
    },
    voiceTranscript: 'नमस्कार, भांडुप पश्चिम स्टेशन रोडजवळ मुख्य सांडपाण्याची पाईपलाईन फुटली आहे. पिण्याच्या पाण्यात घाण पाणी मिसळत आहे आणि दुर्गंधी पसरली आहे.'
  },
  {
    id: 'gov-103',
    ticketNumber: 'NDPI-1930-7712',
    citizenName: 'Subir Roy',
    citizenPhone: '+91 98300 55667',
    language: 'hi',
    category: 'Electricity & Grid',
    assignedDepartment: 'Electricity Distribution Corp',
    title: 'High-Voltage 33kV Substation Transformer Explosion & Power Grid Loss',
    description: 'Substation transformer fault caused 48-hour continuous power blackout across 14 municipal wards, impacting government hospitals and cold storage units.',
    location: {
      address: 'Ultadanga Main Substation, VIP Road Junction',
      city: 'Kolkata',
      stateDistrict: 'West Bengal (Kolkata District)',
      country: 'India',
      pinCode: '700067',
      lat: 22.5958,
      lng: 88.3858
    },
    createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    severity: 'Critical',
    complaintCount: 210,
    status: 'Pending',
    costEstimate: {
      amountUSD: 230000,
      amountLocalCurrency: '₹1,92,00,000 INR',
      breakdown: {
        materials: 130000,
        labor: 50000,
        equipment: 35000,
        contingency: 15000
      },
      completionTimeDays: 6,
      justification: 'Replacement of 20MVA step-down power transformer, SF6 circuit breaker panel assembly, and underground feeder cable splicing.',
      tenderCode: 'WBSEDCL-TRANS-2026-991'
    },
    voiceTranscript: 'नमस्ते, उल्टोडांगा मेन सबस्टेशन में ट्रांसफॉर्मर फटने से आग लग गई है। पूरे इलाके और अस्पताल में बिजली गुल है।'
  },
  {
    id: 'gov-104',
    ticketNumber: 'NDPI-1930-3320',
    citizenName: 'K. Parthiban',
    citizenPhone: '+91 98400 77889',
    language: 'en',
    category: 'Healthcare Infra',
    assignedDepartment: 'Health Infrastructure Directorate',
    title: 'District Civil Hospital Power Backup & Oxygen Pipeline Sensor Failure',
    description: 'Over 98 urgent calls logged regarding central medical oxygen delivery system pressure drops and failure of diesel generator automatic transfer switch.',
    location: {
      address: 'District Headquarters Civil Hospital, Anna Salai',
      city: 'Chennai',
      stateDistrict: 'Tamil Nadu (Chennai District)',
      country: 'India',
      pinCode: '600002',
      lat: 13.0604,
      lng: 80.2496
    },
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    severity: 'Critical',
    complaintCount: 98,
    status: 'Pending',
    costEstimate: {
      amountUSD: 95000,
      amountLocalCurrency: '₹79,00,000 INR',
      breakdown: {
        materials: 48000,
        labor: 28000,
        equipment: 14000,
        contingency: 5000
      },
      completionTimeDays: 4,
      justification: 'Medical gas manifold digital pressure regulator unit replacement, 250kVA ATS panel installation, and liquid oxygen tank re-calibration.',
      tenderCode: 'TN-HEALTH-INFRA-2026-440'
    },
    voiceTranscript: 'Hello, central medical oxygen delivery system pressure drop and generator automatic transfer switch failure reported at District Civil Hospital.'
  },
  {
    id: 'gov-105',
    ticketNumber: 'NDPI-1930-5510',
    citizenName: 'Narayana Reddy',
    citizenPhone: '+91 98490 88990',
    language: 'hi',
    category: 'Roads & Bridges',
    assignedDepartment: 'NHAI (Highways & Expressways)',
    title: 'Highway Road Caved-In near Industrial Corridor Expressway',
    description: '76 citizen phone reports received on toll-free line describing a 12-foot wide deep road sinkhole created by underground soil erosion during heavy downpours.',
    location: {
      address: 'NH-65 Vijayawada Highway, Near HITEC City Flyover Exit',
      city: 'Hyderabad',
      stateDistrict: 'Telangana (Ranga Reddy)',
      country: 'India',
      pinCode: '500081',
      lat: 17.4435,
      lng: 78.3772
    },
    createdAt: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
    severity: 'Major',
    complaintCount: 76,
    status: 'Pending',
    costEstimate: {
      amountUSD: 78000,
      amountLocalCurrency: '₹65,00,000 INR',
      breakdown: {
        materials: 42000,
        labor: 22000,
        equipment: 10000,
        contingency: 4000
      },
      completionTimeDays: 5,
      justification: 'Excavation, GSB sub-base soil compaction, lean concrete filling, and dense bituminous macadam top surfacing.',
      tenderCode: 'TSRDC-HWY-2026-118'
    },
    voiceTranscript: 'नमस्ते, हाईटेक सिटी फ्लाईओवर एग्जिट के पास सड़क धंस गई है और बड़ा गड्ढा बन गया है।'
  },
  {
    id: 'gov-106',
    ticketNumber: 'NDPI-1930-8801',
    citizenName: 'Ramesh Patel',
    citizenPhone: '+91 98250 11223',
    language: 'hi',
    category: 'Public Transport',
    assignedDepartment: 'Metro & Mass Transit Corp',
    title: 'BRTS Corridor Bus Station Glass Canopy Collapse & Signal Breakdown',
    description: 'High winds dislodged structural glass roof panels at central transit terminal, halting 3 transit routes servicing 38,000 daily commuters.',
    location: {
      address: 'BRTS Central Corridor, Ashram Road',
      city: 'Ahmedabad',
      stateDistrict: 'Gujarat (Ahmedabad District)',
      country: 'India',
      pinCode: '380009',
      lat: 23.0300,
      lng: 72.5800
    },
    createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
    severity: 'Major',
    complaintCount: 64,
    status: 'Pending',
    costEstimate: {
      amountUSD: 48000,
      amountLocalCurrency: '₹40,00,000 INR',
      breakdown: {
        materials: 26000,
        labor: 14000,
        equipment: 6000,
        contingency: 2000
      },
      completionTimeDays: 7,
      justification: 'Structural steel truss reinforcement, laminated safety glass replacement, and automated ticketing gate wiring.',
      tenderCode: 'AMC-BRTS-2026-039'
    },
    voiceTranscript: 'નમસ્તે, આશ્રમ રોડ બીઆરટીએસ સ્ટેન્ડનું કાચનું છાપરું પવનમાં તૂટી પડ્યું છે. મુસાફરો માટે જોખમ ઊભું થયું છે.'
  },
  {
    id: 'gov-107',
    ticketNumber: 'NDPI-1930-2211',
    citizenName: 'Deepak Sharma',
    citizenPhone: '+91 98100 44556',
    language: 'hi',
    category: 'Water & Sanitation',
    assignedDepartment: 'Jal Board (Water & Sewage)',
    title: 'Main Canal Sluice Gate Malfunction & Agriculture Inundation',
    description: 'Automatic hydraulic gate actuator failure caused uncontrolled water release along regional distribution canal, flooding 45 hectares of agricultural fields.',
    location: {
      address: 'Yamuna Western Canal Gate #14, Sector 62',
      city: 'Noida',
      stateDistrict: 'Uttar Pradesh (Gautam Buddha Nagar)',
      country: 'India',
      pinCode: '201309',
      lat: 28.6270,
      lng: 77.3726
    },
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    severity: 'Major',
    complaintCount: 112,
    status: 'Pending',
    costEstimate: {
      amountUSD: 82000,
      amountLocalCurrency: '₹68,00,000 INR',
      breakdown: {
        materials: 44000,
        labor: 24000,
        equipment: 10000,
        contingency: 4000
      },
      completionTimeDays: 4,
      justification: 'Hydraulic piston seal replacement, digital flow control telemetry repair, and embanking reinforced soil bags.',
      tenderCode: 'UP-IRRIGATION-2026-772'
    },
    voiceTranscript: 'नमस्ते, यमुना पश्चिमी नहर का गेट नंबर 14 खराब हो गया है। नहर का पानी खेतों और सड़कों पर तेजी से भर रहा है।'
  },
  {
    id: 'gov-108',
    ticketNumber: 'NDPI-1930-9015',
    citizenName: 'Igor Volkov',
    citizenPhone: '+7 916 999 8877',
    language: 'ru',
    category: 'Water & Sanitation',
    assignedDepartment: 'Jal Board (Water & Sewage)',
    title: 'Central Thermal District Heating Main Line Pipe Burst',
    description: 'Sub-zero freezing burst underground high-pressure steam distribution line, cutting off heating to 34 apartment towers.',
    location: {
      address: 'Leninsky Prospekt Sector 12',
      city: 'Moscow',
      stateDistrict: 'Central Administrative Okrug',
      country: 'Russia',
      lat: 55.7069,
      lng: 37.5855
    },
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    severity: 'Critical',
    complaintCount: 175,
    status: 'Pending',
    costEstimate: {
      amountUSD: 185000,
      amountLocalCurrency: '₽17,000,000 RUB',
      breakdown: {
        materials: 90000,
        labor: 55000,
        equipment: 25000,
        contingency: 15000
      },
      completionTimeDays: 4,
      justification: 'Excavation under frost line, seamless pre-insulated steel thermal pipe replacement, and boiler plant pressure balancing.',
      tenderCode: 'MOS-MOSTEK-2026-302'
    },
    voiceTranscript: 'Здравствуйте, на Ленинском проспекте прорвало магистраль отопления! В 34 домах нет тепла, на улице минусовая температура!'
  }
];
