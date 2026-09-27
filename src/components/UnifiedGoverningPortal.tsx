import React, { useState } from 'react';
import { Complaint, RegionalLanguage, SMSNotification } from '../types';
import { OFFICIAL_REGIONAL_LANGUAGES } from '../data/initialComplaints';
import {
  speakRegionalText,
  stopRegionalText,
  generateRegionalComplaintAudioText,
  generateSanctionNoticeAudioText
} from '../utils/speech';
import { MapComponent } from './MapComponent';
import {
  PhoneCall,
  Volume2,
  Pause,
  Play,
  CheckCircle2,
  Clock,
  Hammer,
  MapPin,
  Building2,
  Shield,
  Sparkles,
  Megaphone,
  Radio,
  Users,
  AlertTriangle,
  Coins,
  TrendingUp,
  FileCheck,
  Send,
  RefreshCw,
  Info
} from 'lucide-react';

interface UnifiedGoverningPortalProps {
  complaints: Complaint[];
  allComplaints: Complaint[];
  smsNotifications: SMSNotification[];
  selectedLanguage: RegionalLanguage;
  onLanguageChange: (lang: RegionalLanguage) => void;
  onOpenIVRModal: () => void;
  onSanctionWorkOrder: (complaint: Complaint) => void;
  onResolveComplaint: (complaint: Complaint) => void;
  onAnalyzeCost: (complaint: Complaint) => void;
  onResetData: () => void;
}

export const UnifiedGoverningPortal: React.FC<UnifiedGoverningPortalProps> = ({
  complaints,
  allComplaints,
  smsNotifications,
  selectedLanguage,
  onLanguageChange,
  onOpenIVRModal,
  onSanctionWorkOrder,
  onResolveComplaint,
  onAnalyzeCost,
  onResetData,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PRIORITY' | 'BULLETIN' | 'MAP'>('PRIORITY');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0] || null);

  const currentLangObj = OFFICIAL_REGIONAL_LANGUAGES.find((l) => l.code === selectedLanguage);

  // Audio Readout Helper in Regional Language
  const handlePlayAudio = (id: string, textToSpeak: string) => {
    if (playingId === id) {
      stopRegionalText();
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    speakRegionalText(
      textToSpeak,
      selectedLanguage,
      () => setPlayingId(id),
      () => setPlayingId(null)
    );
  };

  // Filtered Lists
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending');
  const inProgressComplaints = allComplaints.filter((c) => c.status === 'In Progress');
  const solvedComplaints = allComplaints.filter((c) => c.status === 'Solved');

  const topPriorityComplaint = complaints[0];

  return (
    <div className="space-y-6 font-sans text-slate-900 bg-slate-100 min-h-screen pb-16">
      {/* Official Government Header Banner - International Standard */}
      <header className="bg-slate-900 text-white border-b-4 border-amber-500 shadow-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Government Emblem & Title */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-xl font-black tracking-tight text-white font-display">
                    National Public Infrastructure Command System
                  </h1>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    Line 1930
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Digital Public Infrastructure (DPI) • Regional Voice AI • Real-Time Civil Budget Allocation
                </p>
              </div>
            </div>

            {/* Language Selection & Toll-Free Helpline Button */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Regional Voice Selector */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Language:</span>
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as RegionalLanguage)}
                  className="bg-transparent text-xs font-extrabold text-white focus:outline-none cursor-pointer"
                >
                  {OFFICIAL_REGIONAL_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                      {lang.flag} {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Call 1930 Helpline Launcher */}
              <button
                onClick={onOpenIVRModal}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 border border-red-400/30"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>📞 Call Toll-Free 1930 Hotline</span>
              </button>

              <button
                onClick={onResetData}
                title="Reset Live Dataset"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top 1930 Live Helpline Action & Summary Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Info */}
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>LIVE CITIZEN COMPLAINT HELPLINE • DIAL 1930</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Reported Infrastructure Issues & Regional Voice Bulletin
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                When citizens call <strong className="text-blue-700 font-extrabold">1930</strong>, reports are grouped by location, analyzed by regional AI, and ranked in <strong className="text-red-600 font-extrabold">strict descending order of caller volume</strong>. The highest complaint location automatically becomes <strong className="text-red-600 font-bold">Rank #1</strong> for civil budget allocation.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto text-center">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Calls</span>
                <span className="text-xl font-black text-slate-900">{complaints.reduce((acc, c) => acc + (c.complaintCount || 1), 0)}</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Work Sanctioned</span>
                <span className="text-xl font-black text-amber-800">{inProgressComplaints.length}</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Fixed & Solved</span>
                <span className="text-xl font-black text-emerald-800">{solvedComplaints.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('PRIORITY')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'PRIORITY'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1. Descending Priority Queue (Highest Calls = Rank #1)</span>
          </button>

          <button
            onClick={() => setActiveTab('BULLETIN')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'BULLETIN'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>2. Government Sanctioned Public Solutions ({inProgressComplaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MAP')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'MAP'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>3. Regional GIS Hotspot Map</span>
          </button>
        </div>

        {/* TAB 1: DESCENDING PRIORITY MATRIX */}
        {activeTab === 'PRIORITY' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Strict Descending Order Rule:</strong> The complaint location with the highest number of citizen 1930 calls is placed at <strong>Rank #1</strong>. Tap the blue <strong>🔊 Listen Button</strong> to hear any complaint spoken out loud in <strong>{currentLangObj?.nativeName || 'your regional language'}</strong>.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map((c, index) => {
                const rankNumber = index + 1;
                const budgetText = c.costEstimate.amountLocalCurrency || `$${c.costEstimate.amountUSD.toLocaleString()} USD`;
                const audioText = generateRegionalComplaintAudioText(c, selectedLanguage, rankNumber);

                return (
                  <div
                    key={c.id}
                    className={`bg-white border rounded-3xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between ${
                      rankNumber === 1
                        ? 'border-2 border-red-500 ring-2 ring-red-100'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Card Header: Rank & Call Count */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-xl font-extrabold text-xs shadow-sm ${
                              rankNumber === 1
                                ? 'bg-red-600 text-white animate-pulse'
                                : rankNumber === 2
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-800 text-white'
                            }`}
                          >
                            RANK #{rankNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 font-extrabold text-xs border border-red-200 flex items-center gap-1">
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>{c.complaintCount} Callers</span>
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-400">{c.ticketNumber}</span>
                      </div>

                      {/* Issue Details */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-display line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                      </div>

                      {/* Location Badge */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{c.location.city}, {c.location.stateDistrict || c.location.country}</span>
                      </div>

                      {/* Location-Specific Allocated Civil Engineering Budget */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-blue-900 flex items-center gap-1">
                            <Coins className="w-4 h-4 text-blue-600" />
                            <span>Allocated Budget:</span>
                          </span>
                          <span className="font-black text-blue-700 text-sm">{budgetText}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex justify-between">
                          <span>Target Repair SLA:</span>
                          <span className="font-bold text-slate-700">{c.costEstimate.completionTimeDays} Calendar Days</span>
                        </div>
                      </div>

                      {/* Accessible Regional Audio Readout Button */}
                      <button
                        onClick={() => handlePlayAudio(c.id, audioText)}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        {playingId === c.id ? (
                          <>
                            <Pause className="w-4 h-4 text-indigo-600" />
                            <span>Pause Audio Readout</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-indigo-600" />
                            <span>🔊 Hear Report ({currentLangObj?.nativeName})</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Government Sanction Action */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {c.status === 'In Progress' ? (
                        <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Hammer className="w-4 h-4 text-amber-600 animate-bounce" />
                            <span>Work Order Sanctioned</span>
                          </span>
                          <button
                            onClick={() => onResolveComplaint(c)}
                            className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          >
                            Mark Solved
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSanctionWorkOrder(c)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Sanction Civil Budget & Send Citizen Alert</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GOVERNMENT SANCTIONED PUBLIC BULLETIN */}
        {activeTab === 'BULLETIN' && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Official Sanctions Bulletin:</strong> Whenever a work order is approved, all budget allocations, assigned civil engineering crews, and repair SLAs are publicly broadcasted here for transparency.
                </span>
              </div>
            </div>

            {inProgressComplaints.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 text-xs space-y-2">
                <p className="font-bold text-slate-700">No active sanctioned work orders at this moment.</p>
                <p>Go to the Priority Queue tab and click "Sanction Civil Budget" on any reported complaint.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressComplaints.map((c) => {
                  const budgetText = c.costEstimate.amountLocalCurrency || `$${c.costEstimate.amountUSD.toLocaleString()} USD`;
                  const audioText = generateSanctionNoticeAudioText(c, selectedLanguage);

                  return (
                    <div
                      key={c.id}
                      className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-md relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5">
                          <Hammer className="w-4 h-4 text-emerald-600 animate-bounce" />
                          GOVERNMENT WORK SANCTIONED
                        </span>
                        <span className="text-xs font-mono text-slate-400">{c.ticketNumber}</span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 font-display">{c.title}</h3>
                        <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                      </div>

                      {/* Sanction Budget Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Sanctioned Budget</span>
                          <span className="text-sm font-black text-emerald-600">{budgetText}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Department</span>
                          <span className="text-xs font-bold text-slate-800 truncate block">{c.assignedDepartment}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                          <span className="text-xs font-semibold text-slate-700">{c.location.city}</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Target SLA</span>
                          <span className="text-xs font-bold text-amber-600">{c.costEstimate.completionTimeDays} Days Completion</span>
                        </div>
                      </div>

                      {/* Hear Audio Readout Button */}
                      <button
                        onClick={() => handlePlayAudio(c.id, audioText)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
                      >
                        {playingId === c.id ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span>{playingId === c.id ? 'Stop Audio Readout' : `🔊 Hear Sanction Notice (${currentLangObj?.nativeName})`}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGIONAL GIS HOTSPOT MAP */}
        {activeTab === 'MAP' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Live Infrastructure GIS Map</h3>
                <p className="text-xs text-slate-500">Interactive geographic visualization of 1930 call locations and priority ranks.</p>
              </div>
            </div>

            <MapComponent
              complaints={complaints}
              selectedComplaintId={selectedComplaint?.id}
              onSelectComplaint={(id) => {
                const target = complaints.find((c) => c.id === id);
                if (target) setSelectedComplaint(target);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};
