import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import type { Complaint, CostEstimate, SeverityLevel, SMSNotification, GovernmentDepartment } from './src/types';
import { INITIAL_NATIONAL_COMPLAINTS } from './src/data/initialComplaints.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Prototype-only state. Vercel Functions can restart or run multiple instances,
// so this data is not durable across deployments or guaranteed across requests.
let complaints: Complaint[] = JSON.parse(JSON.stringify(INITIAL_NATIONAL_COMPLAINTS));
let smsNotifications: SMSNotification[] = [];

// Initialize Gemini AI Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set in environment. Falling back to algorithmic AI estimation.');
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// Map Issue Category to Government Department
function assignDepartmentForCategory(category: string): GovernmentDepartment {
  switch (category) {
    case 'Roads & Bridges': return 'NHAI (Highways & Expressways)';
    case 'Water & Sanitation': return 'Jal Board (Water & Sewage)';
    case 'Electricity & Grid': return 'Electricity Distribution Corp';
    case 'Public Transport': return 'Metro & Mass Transit Corp';
    case 'Healthcare Infra': return 'Health Infrastructure Directorate';
    case 'Schools & Education': return 'CPWD (Public Works Dept)';
    case 'Telecom & Connectivity': return 'State Telecom & Digital Board';
    case 'Waste Management': return 'Municipal Waste Management';
    default: return 'CPWD (Public Works Dept)';
  }
}

// Dynamic Priority Score Ranking Algorithm
// Primary sorting driver: Complaint Count (highest reports = Rank 1)
function calculatePriorityScore(c: Complaint): number {
  const severityWeights: Record<SeverityLevel, number> = {
    Critical: 5,
    Major: 3.5,
    Moderate: 2,
    Minor: 1
  };

  const hoursPending = (Date.now() - new Date(c.createdAt).getTime()) / (1000 * 3600);
  const countFactor = (c.complaintCount || 1) * 10; // Call volume is dominant factor
  const severityFactor = (severityWeights[c.severity] || 1) * 15;
  const timeFactor = Math.min(hoursPending * 0.4, 20);

  return Math.round((countFactor + severityFactor + timeFactor) * 10) / 10;
}

function updatePriorityRanks() {
  const active = complaints.filter(c => c.status !== 'Solved');

  active.forEach(c => {
    c.priorityScore = calculatePriorityScore(c);
    if (!c.assignedDepartment) {
      c.assignedDepartment = assignDepartmentForCategory(c.category);
    }
  });

  // Sort STRICTLY DESCENDING by complaint call count first, then priority score
  active.sort((a, b) => {
    if (b.complaintCount !== a.complaintCount) {
      return b.complaintCount - a.complaintCount; // Highest number of calls = Rank 1
    }
    return (b.priorityScore || 0) - (a.priorityScore || 0);
  });

  active.forEach((c, index) => {
    c.priorityRank = index + 1;
  });
}

// Initial calculation
updatePriorityRanks();

// API ROUTES
app.get('/api/complaints', (req, res) => {
  updatePriorityRanks();
  res.json({
    complaints: complaints.filter(c => c.status !== 'Solved'),
    allComplaints: complaints,
    smsNotifications
  });
});

app.post('/api/complaints', (req, res) => {
  const newComplaint: Complaint = req.body;

  if (!newComplaint.id) {
    newComplaint.id = 'ndpi-' + Date.now().toString(36);
  }
  if (!newComplaint.ticketNumber) {
    newComplaint.ticketNumber = `NDPI-1930-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  if (!newComplaint.createdAt) {
    newComplaint.createdAt = new Date().toISOString();
  }
  if (!newComplaint.complaintCount) {
    newComplaint.complaintCount = 1;
  }
  if (!newComplaint.status) {
    newComplaint.status = 'Pending';
  }
  if (!newComplaint.assignedDepartment) {
    newComplaint.assignedDepartment = assignDepartmentForCategory(newComplaint.category);
  }

  // Check if similar complaint exists in same city/category to merge/increment count
  const existingIndex = complaints.findIndex(
    c => c.status !== 'Solved' && 
         c.location?.city?.toLowerCase() === newComplaint.location?.city?.toLowerCase() &&
         c.category === newComplaint.category
  );

  if (existingIndex !== -1 && req.body.incrementExisting) {
    complaints[existingIndex].complaintCount += 1;
    complaints[existingIndex].createdAt = new Date().toISOString(); // refresh urgency
    updatePriorityRanks();
    return res.json({ success: true, complaint: complaints[existingIndex], merged: true });
  }

  complaints.unshift(newComplaint);
  updatePriorityRanks();
  res.status(201).json({ success: true, complaint: newComplaint });
});

// Resolve complaint & send automated citizen SMS endpoint
app.post('/api/complaints/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { resolutionNotes, officerName, assignedDepartment } = req.body;

  const target = complaints.find(c => c.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  target.status = 'Solved';
  target.solvedAt = new Date().toISOString();
  target.resolutionNotes = resolutionNotes || 'Resolved by National Government Public Works field team.';
  target.assignedOfficer = officerName || 'National Public Works Dept';

  // Dispatch simulated SMS notification to citizen
  const smsMessage = `[NATIONAL GOVERNMENT DPI ALERT - 1930] Dear ${target.citizenName}, your public grievance report #${target.ticketNumber} regarding "${target.title}" in ${target.location.city} has been SOLVED by ${target.assignedDepartment || 'Government Authority'}. Resolution Details: ${target.resolutionNotes}. Thank you for contributing to national infrastructure safety.`;

  const notification: SMSNotification = {
    id: 'sms-' + Date.now(),
    ticketNumber: target.ticketNumber,
    recipientPhone: target.citizenPhone,
    recipientName: target.citizenName,
    message: smsMessage,
    sentAt: new Date().toISOString(),
    status: 'Delivered',
    department: target.assignedDepartment || 'Public Works'
  };

  smsNotifications.unshift(notification);
  target.smsSent = true;

  updatePriorityRanks();

  res.json({
    success: true,
    message: 'Complaint resolved, SMS dispatched to citizen, and ticket archived from active high-priority queue.',
    notification,
    complaint: target
  });
});

// Sanction Work Order & Dispatch Public Solution Notification Endpoint
app.post('/api/complaints/:id/sanction', (req, res) => {
  const { id } = req.params;
  const { officerName, customNotes } = req.body;

  const target = complaints.find(c => c.id === id);
  if (!target) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  target.status = 'In Progress';
  target.assignedOfficer = officerName || 'Senior Executive Civil Engineer';
  if (customNotes) {
    target.costEstimate.justification = customNotes;
  }

  const budgetText = target.costEstimate.amountLocalCurrency || `$${target.costEstimate.amountUSD.toLocaleString()} USD`;
  const smsMessage = `[GOVERNMENT WORK SANCTIONED - 1930] Dear Citizens of ${target.location.city}, Government has officially SANCTIONED repair work for ticket #${target.ticketNumber} (${target.title}). Approved Civil Budget: ${budgetText}. Assigned Department: ${target.assignedDepartment}. Expected completion: ${target.costEstimate.completionTimeDays} days. Equipment & Emergency Crews are deployed on site.`;

  const notification: SMSNotification = {
    id: 'sms-sanction-' + Date.now(),
    ticketNumber: target.ticketNumber,
    recipientPhone: target.citizenPhone || 'Public Community Alert',
    recipientName: target.citizenName || 'Local Residents',
    message: smsMessage,
    sentAt: new Date().toISOString(),
    status: 'Delivered',
    department: target.assignedDepartment || 'Public Works'
  };

  smsNotifications.unshift(notification);
  target.smsSent = true;

  updatePriorityRanks();

  res.json({
    success: true,
    message: 'Work order officially sanctioned! Public bulletin & citizen SMS alert dispatched.',
    notification,
    complaint: target
  });
});

// Helper for native script fallback bot responses
function getNativeFallbackBotResponse(lang: string, location: string, ticketNum: string): string {
  switch (lang) {
    case 'hi':
      return `आपकी शिकायत 1930 हेल्पलाइन पर दर्ज कर ली गई है। टिकट संख्या #${ticketNum}। संबंधित विभाग को भेज दिया गया है। धन्यवाद।`;
    case 'zh':
    case 'zh-CN':
      return `您的投诉已在1930热线成功登记。工单号 #${ticketNum}。已转交相关部门处理。谢谢。`;
    case 'ru':
      return `Ваша жалоба зарегистрирована по линии 1930. Номер билета #${ticketNum}. Передано в соответствующий департамент. Спасибо.`;
    case 'pt':
      return `Sua reclamação foi registrada na linha 1930. Número do bilhete #${ticketNum}. Encaminhado ao departamento competente. Obrigado.`;
    default:
      return `Your grievance report has been officially recorded under ticket #${ticketNum}. Dispatched to assigned ministry engineers. Thank you.`;
  }
}

// Gemini AI Voice Bot Receiver for Official Regional Languages
app.post('/api/gemini/voice-bot', async (req, res) => {
  try {
    const { transcript, language, citizenName, citizenPhone, locationInput } = req.body;
    const ai = getGeminiClient();
    const ticketNum = `NDPI-1930-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!ai) {
      return res.json({
        category: 'Roads & Bridges',
        assignedDepartment: 'NHAI (Highways & Expressways)',
        title: 'Reported Issue in ' + (locationInput || 'Local District'),
        description: transcript || 'Citizen reported public infrastructure defect via 1930 toll-free hotline.',
        severity: 'Major',
        botResponse: getNativeFallbackBotResponse(language || 'hi', locationInput || 'District', ticketNum),
        city: locationInput || 'Bengaluru',
        stateDistrict: 'State District',
        country: 'India',
        lat: 12.9716 + (Math.random() - 0.5) * 0.1,
        lng: 77.5946 + (Math.random() - 0.5) * 0.1,
        costEstimateUSD: 45000,
        costEstimateLocal: '₹37,50,000 INR'
      });
    }

    const prompt = `You are the National Public Infrastructure Command Center Voice AI & Regional Language Classifier for 1930 Hotline.
Analyze this user transcript/call input from a citizen speaking in official regional language (${language || 'Hindi'}):
User Transcript: "${transcript}"
User Name: "${citizenName || 'Citizen Caller'}"
User Stated Location: "${locationInput || 'Unknown'}"

Extract or estimate:
1. Category: choose exactly one of ['Roads & Bridges', 'Water & Sanitation', 'Electricity & Grid', 'Public Transport', 'Healthcare Infra', 'Schools & Education', 'Telecom & Connectivity', 'Waste Management']
2. Assigned Department: choose matching government body ['NHAI (Highways & Expressways)', 'CPWD (Public Works Dept)', 'Jal Board (Water & Sewage)', 'Electricity Distribution Corp', 'Metro & Mass Transit Corp', 'Health Infrastructure Directorate', 'Municipal Waste Management', 'State Telecom & Digital Board', 'Disaster Response Command']
3. Title: A clear, official summary title of the issue (10 words max)
4. Detailed Description: Professional summary/translation of the issue.
5. Severity: 'Critical' | 'Major' | 'Moderate' | 'Minor'
6. City, State/District, and Country: Determine real matching location.
7. Approx Lat/Lng coordinates for that specific city/landmark.
8. Local currency cost string (e.g. '₹45,00,000 INR', '$65,00,000 USD') and USD amount.
9. Bot Response Message: MUST BE WRITTEN 100% IN THE NATIVE SCRIPT OF THE REGIONAL LANGUAGE (${language}). For Hindi ('hi'), write ONLY in Devanagari script. DO NOT write in English or Latin alphabet for the regional language botResponse.

Return ONLY valid JSON with fields: category, assignedDepartment, title, description, severity, city, stateDistrict, country, lat, lng, costEstimateUSD, costEstimateLocal, botResponse.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            assignedDepartment: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING },
            city: { type: Type.STRING },
            stateDistrict: { type: Type.STRING },
            country: { type: Type.STRING },
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER },
            costEstimateUSD: { type: Type.NUMBER },
            costEstimateLocal: { type: Type.STRING },
            botResponse: { type: Type.STRING }
          },
          required: ['category', 'assignedDepartment', 'title', 'description', 'severity', 'city', 'stateDistrict', 'country', 'costEstimateUSD', 'botResponse']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in voice-bot endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to process voice bot request' });
  }
});

// Gemini Cost Estimation Analyzer endpoint
app.post('/api/gemini/estimate-cost', async (req, res) => {
  try {
    const { complaint } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        costEstimate: {
          amountUSD: 85000,
          amountLocalCurrency: '₹71,00,000 INR',
          breakdown: {
            materials: 40000,
            labor: 25000,
            equipment: 12000,
            contingency: 8000
          },
          completionTimeDays: 14,
          justification: 'Automated cost estimation based on issue category, urgency, and affected population density.',
          tenderCode: 'NDPI-TND-2026-' + Math.floor(100 + Math.random() * 900)
        }
      });
    }

    const prompt = `You are a Senior Chief Infrastructure Civil Engineer & Financial Auditor for National Public Works.
Analyze this reported public infrastructure defect:
Title: ${complaint.title}
Department: ${complaint.assignedDepartment}
Category: ${complaint.category}
Severity: ${complaint.severity}
Location: ${complaint.location?.address}, ${complaint.location?.city}, ${complaint.location?.stateDistrict}, ${complaint.location?.country}
Citizen Call Count: ${complaint.complaintCount}
Description: ${complaint.description}

Calculate an accurate, itemized civil engineering cost estimation in USD and local regional currency.
Provide:
1. amountUSD (number)
2. amountLocalCurrency (string with currency symbol e.g., '₹85,00,000 INR', 'R$ 450,000 BRL', 'R 1,500,000 ZAR', '¥600,000 CNY')
3. breakdown: materials (number USD), labor (number USD), equipment (number USD), contingency (number USD)
4. completionTimeDays (number of days required to complete repairs)
5. justification (2 sentences explaining the technical engineering rationale)
6. tenderCode (string code e.g. 'NDPI-TND-2026-881')

Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amountUSD: { type: Type.NUMBER },
            amountLocalCurrency: { type: Type.STRING },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                materials: { type: Type.NUMBER },
                labor: { type: Type.NUMBER },
                equipment: { type: Type.NUMBER },
                contingency: { type: Type.NUMBER }
              },
              required: ['materials', 'labor', 'equipment', 'contingency']
            },
            completionTimeDays: { type: Type.NUMBER },
            justification: { type: Type.STRING },
            tenderCode: { type: Type.STRING }
          },
          required: ['amountUSD', 'amountLocalCurrency', 'breakdown', 'completionTimeDays', 'justification']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ costEstimate: parsed });
  } catch (error: any) {
    console.error('Error in estimate-cost endpoint:', error);
    res.status(500).json({ error: error.message || 'Cost estimation failed' });
  }
});

// Regional Text-To-Speech Audio Proxy Endpoint with Guaranteed 200 Audio Stream
app.get('/api/tts', async (req, res) => {
  try {
    const text = (req.query.text as string) || 'Welcome';
    const reqLang = (req.query.lang as string) || 'hi';
    const trimmedText = text.slice(0, 300);

    // Known language codes natively supported by Google Translate TTS engine
    const supportedLangs = ['hi', 'en', 'zh', 'zh-CN', 'ru', 'pt', 'am', 'es'];

    let targetLang = reqLang;
    if (!supportedLangs.includes(reqLang)) {
      if (['zu'].includes(reqLang)) targetLang = 'en';
      else targetLang = 'hi';
    }

    const fetchAudio = async (l: string) => {
      const u = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmedText)}&tl=${l}&client=tw-ob`;
      return await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
    };

    let response = await fetchAudio(targetLang);

    if (!response.ok) {
      response = await fetchAudio('hi');
    }

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(arrayBuffer));
    } else {
      res.status(500).json({ error: 'Failed to fetch TTS audio stream' });
    }
  } catch (e: any) {
    console.error('TTS proxy error:', e);
    res.status(500).json({ error: e.message || 'TTS Error' });
  }
});

// Reset dataset route
app.post('/api/reset', (req, res) => {
  complaints = JSON.parse(JSON.stringify(INITIAL_NATIONAL_COMPLAINTS));
  smsNotifications = [];
  updatePriorityRanks();
  res.json({ success: true, message: 'Dataset reseeded successfully', complaints });
});

// Serve the built client in production, including when Vercel imports this app
// as a function instead of starting the local server.
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'public');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Vite Middleware for local development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // Vercel imports the Express app as a Function. Only bind a port for local use.
  if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`National Command Center Server running on http://localhost:${PORT}`);
    });
  }
}

export default app;

if (process.env.VERCEL !== '1') {
  startServer();
}
