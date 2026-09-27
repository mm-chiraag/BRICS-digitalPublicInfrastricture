export type RegionalLanguage = 
  | 'en'   // English
  | 'hi'   // Hindi (हिन्दी)
  | 'zh'   // Mandarin Chinese (中文)
  | 'ru'   // Russian (Русский)
  | 'pt'   // Portuguese (Português)
  | 'am'   // Amharic (አማርኛ)
  | 'zu';  // Zulu (isiZulu)

export interface LanguageInfo {
  code: RegionalLanguage;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
  speechCode?: string;
}

export type SeverityLevel = 'Critical' | 'Major' | 'Moderate' | 'Minor';

export type IssueCategory = 
  | 'Roads & Bridges' 
  | 'Water & Sanitation' 
  | 'Electricity & Grid' 
  | 'Public Transport' 
  | 'Healthcare Infra' 
  | 'Schools & Education' 
  | 'Telecom & Connectivity' 
  | 'Waste Management';

export type GovernmentDepartment = 
  | 'NHAI (Highways & Expressways)' 
  | 'CPWD (Public Works Dept)' 
  | 'Jal Board (Water & Sewage)' 
  | 'Electricity Distribution Corp' 
  | 'Metro & Mass Transit Corp' 
  | 'Health Infrastructure Directorate' 
  | 'Municipal Waste Management' 
  | 'State Telecom & Digital Board'
  | 'Disaster Response Command';

export interface LocationData {
  address: string;
  city: string;
  stateDistrict: string;
  country: string;
  lat: number;
  lng: number;
  pinCode?: string;
}

export interface CostEstimate {
  amountUSD: number;
  amountLocalCurrency: string;
  breakdown: {
    materials: number;
    labor: number;
    equipment: number;
    contingency: number;
  };
  completionTimeDays: number;
  justification: string;
  tenderCode?: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  citizenName: string;
  citizenPhone: string;
  language: RegionalLanguage;
  category: IssueCategory;
  assignedDepartment: GovernmentDepartment;
  title: string;
  description: string;
  location: LocationData;
  createdAt: string; // ISO string
  severity: SeverityLevel;
  complaintCount: number; // Number of similar reports in same area
  status: 'Pending' | 'In Progress' | 'Solved';
  priorityRank?: number;
  priorityScore?: number;
  costEstimate: CostEstimate;
  voiceTranscript?: string;
  audioDurationSeconds?: number;
  solvedAt?: string;
  resolutionNotes?: string;
  assignedOfficer?: string;
  smsSent?: boolean;
}

export interface SMSNotification {
  id: string;
  ticketNumber: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending';
  department: string;
}

export interface LiveIVRCallFeed {
  id: string;
  phone: string;
  callerName: string;
  language: RegionalLanguage;
  stateLocation: string;
  rawAudioTranscript: string;
  timestamp: string;
  status: 'ANALYZING' | 'DISPATCHED' | 'PROCESSED';
}
