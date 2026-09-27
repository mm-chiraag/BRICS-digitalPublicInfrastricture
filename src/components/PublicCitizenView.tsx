import React, { useState } from 'react';
import { Complaint, RegionalLanguage, SMSNotification } from '../types';
import { OFFICIAL_REGIONAL_LANGUAGES } from '../data/initialComplaints';
import {
  speakRegionalText,
  stopRegionalText,
  generateRegionalComplaintAudioText,
  generateSanctionNoticeAudioText
} from '../utils/speech';
import { PhoneCall, Volume2, Pause, Play, CheckCircle2, Clock, Hammer, MapPin, Building2, Shield, Sparkles, Megaphone, Smartphone, Radio, Users, ChevronRight } from 'lucide-react';

interface PublicCitizenViewProps {
  complaints: Complaint[];
  allComplaints: Complaint[];
  smsNotifications: SMSNotification[];
  selectedLanguage: RegionalLanguage;
  onLanguageChange: (lang: RegionalLanguage) => void;
  onOpenIVRModal: () => void;
}

export const PublicCitizenView: React.FC<PublicCitizenViewProps> = ({
  complaints,
  allComplaints,
  smsNotifications,
  selectedLanguage,
  onLanguageChange,
  onOpenIVRModal,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const currentLangObj = OFFICIAL_REGIONAL_LANGUAGES.find((l) => l.code === selectedLanguage);

  // Read out complaint text out loud in regional language
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

  // Group complaints into stages for clarity
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending');
  const inProgressComplaints = allComplaints.filter((c) => c.status === 'In Progress');
  const solvedComplaints = allComplaints.filter((c) => c.status === 'Solved');

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Friendly Hero Banner for Public Citizens */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>OFFICIAL PUBLIC CITIZEN HELPLINE PORTAL • LINE 1930</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Public Grievance Tracker & Government Solution Bulletin
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Report public infrastructure problems in your native language by calling <strong className="text-emerald-300 font-bold">Toll-Free 1930</strong>. Hear official government sanctioned repair budgets, solutions, and completion updates out loud in your regional language.
            </p>

            {/* Quick Language Selector */}
            <div className="flex items-center gap-2 pt-1 flex-wrap justify-center md:justify-start">
              <span className="text-xs text-slate-400 font-semibold">Select Your Language:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                {OFFICIAL_REGIONAL_LANGUAGES.slice(0, 8).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedLanguage === lang.code
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50 scale-105'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Big Accessible 1930 Voice Call Launcher Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onOpenIVRModal}
              className="group p-6 rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-center shadow-2xl shadow-red-950/80 border-2 border-red-300/40 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 w-64"
            >
              <div className="p-3 rounded-full bg-white/20 border border-white/40 group-hover:animate-bounce">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                <div className="text-lg font-black tracking-wider uppercase font-display">
                  📞 CALL TOLL-FREE 1930
                </div>
                <div className="text-xs text-amber-100 font-semibold mt-0.5">
                  Tap to Speak Your Issue ({currentLangObj?.nativeName})
                </div>
              </div>
            </button>
            <span className="text-[11px] text-slate-400 italic">22 Official Regional Languages Supported</span>
          </div>
        </div>
      </div>

      {/* Government Sanctioned Public Solutions Bulletin Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Official Government Sanctioned Solutions & Active Work Orders
              </h2>
              <p className="text-xs text-slate-400">
                Transparent public notice board showing approved budgets, assigned departments, and expected repair completion timelines.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold font-mono">
            {inProgressComplaints.length + solvedComplaints.length} Government Solutions Active
          </span>
        </div>

        {inProgressComplaints.length === 0 && solvedComplaints.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-2">
            <p>No active government work orders sanctioned at this second.</p>
            <p className="text-slate-500">Government authorities review incoming 1930 call reports continuously in the War Room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressComplaints.map((c) => {
              const audioText = generateSanctionNoticeAudioText(c, selectedLanguage);

              return (
                <div
                  key={c.id}
                  className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3.5 shadow-lg relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-extrabold border border-amber-500/30 flex items-center gap-1">
                      <Hammer className="w-3.5 h-3.5 animate-bounce" />
                      WORK SANCTIONED & IN PROGRESS
                    </span>
                    <span className="text-xs font-mono text-slate-400">{c.ticketNumber}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{c.description}</p>
                  </div>

                  {/* High Accessibility Regional Audio Readout Button */}
                  <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-800/60 p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Audio Solution Readout ({currentLangObj?.nativeName})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Tap speaker to hear solution details out loud</div>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(c.id, audioText)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-colors"
                    >
                      {playingId === c.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{playingId === c.id ? 'Stop Audio' : '🔊 Hear Solution'}</span>
                    </button>
                  </div>

                  {/* Public Sanction Budget & Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">APPROVED BUDGET</span>
                      <span className="font-extrabold text-emerald-400">{c.costEstimate.amountLocalCurrency}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">ASSIGNED DEPARTMENT</span>
                      <span className="font-bold text-indigo-300 truncate block">{c.assignedDepartment}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">LOCATION</span>
                      <span className="font-semibold text-slate-200">{c.location.city}, {c.location.stateDistrict || c.location.country}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">TARGET COMPLETION</span>
                      <span className="font-bold text-amber-400">{c.costEstimate.completionTimeDays} Calendar Days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simple 3-Stage Public Community Tracker */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Public Community Grievance Board (Line 1930 Reports)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clear, transparent tracking of caller reports, government work sanctions, and completed resolutions.
            </p>
          </div>
        </div>

        {/* 3 Clear Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Citizen 1930 Reports Received */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-white font-display">1. Citizen Reports Received</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-slate-300">
                {pendingComplaints.length} Reported
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {pendingComplaints.map((c, idx) => {
                const audioText = generateRegionalComplaintAudioText(c, selectedLanguage, c.priorityRank || idx + 1);

                return (
                  <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                        Rank #{c.priorityRank || idx + 1} ({c.complaintCount} Calls)
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{c.ticketNumber}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white">{c.title}</h4>
                    <p className="text-[11px] text-slate-400">{c.description}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">📍 {c.location.city}</span>

                      <button
                        onClick={() => handlePlayAudio(c.id, audioText)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        {playingId === c.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{playingId === c.id ? 'Stop' : '🔊 Hear Audio'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Government Sanctioned & In Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-bounce"></span>
                <h3 className="text-sm font-bold text-white font-display">2. Work Sanctioned & In Progress</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-amber-400">
                {inProgressComplaints.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {inProgressComplaints.map((c) => (
                <div key={c.id} className="bg-slate-950 border border-amber-800/50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 text-[11px]">🛠️ {c.assignedDepartment}</span>
                    <span className="text-[10px] font-mono text-slate-400">{c.ticketNumber}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{c.title}</h4>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    Sanction Budget: {c.costEstimate.amountLocalCurrency}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    SLA: {c.costEstimate.completionTimeDays} Days Target Completion
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Solved & Fixed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-white font-display">3. Solved & Citizen SMS Sent</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-emerald-400">
                {solvedComplaints.length} Solved
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {solvedComplaints.map((c) => (
                <div key={c.id} className="bg-slate-950 border border-emerald-800/50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      SOLVED
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{c.ticketNumber}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{c.title}</h4>
                  <p className="text-[11px] text-slate-300 italic">"{c.resolutionNotes || 'Fixed by Government Crew'}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
