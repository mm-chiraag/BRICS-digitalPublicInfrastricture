import React from 'react';
import { RegionalLanguage } from '../types';
import { OFFICIAL_REGIONAL_LANGUAGES } from '../data/initialComplaints';
import { PhoneCall, Shield, Globe, RefreshCw, Radio, Layers, Flame, Award } from 'lucide-react';

interface NavbarProps {
  selectedLanguage: RegionalLanguage;
  onLanguageChange: (lang: RegionalLanguage) => void;
  onOpenIVRModal: () => void;
  onResetData: () => void;
  activeComplaintsCount: number;
  criticalCount: number;
  viewMode: 'CITIZEN' | 'GOVERNMENT';
  onViewModeChange: (mode: 'CITIZEN' | 'GOVERNMENT') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLanguage,
  onLanguageChange,
  onOpenIVRModal,
  onResetData,
  activeComplaintsCount,
  criticalCount,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-2xl">
      {/* Top Ticker - National Hotline Banner */}
      <div className="bg-gradient-to-r from-red-900 via-amber-900 to-slate-950 text-amber-100 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20">
        <div className="flex items-center gap-3 font-medium">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/40 text-amber-300 font-mono tracking-wider font-bold border border-amber-500/30">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            NATIONAL TOLL-FREE HOTLINE: 1930 / 1800-BRICS-DPI
          </span>
          <span className="hidden md:inline text-amber-200/90 text-[11px]">
            Integrated National Public Works Command & Official Regional Language AI Response Center
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-amber-200 font-semibold text-[11px]">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Public Infrastructure (DPI) Command</span>
          </span>
          <button
            onClick={onResetData}
            title="Reset dataset to initial state"
            className="flex items-center gap-1 bg-amber-950/80 hover:bg-amber-900 text-amber-200 px-2 py-0.5 rounded text-[11px] border border-amber-700/50 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reseed Real Data</span>
          </button>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Emblem & Title */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-slate-800 to-slate-900 border border-indigo-500/40 shadow-xl shadow-indigo-950/60 flex items-center justify-center">
            <Shield className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black text-white tracking-tight font-display">
                National Public Infrastructure Governance System
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                Live Reference System
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Line 1930 Toll-Free Call Integration • Regional Language Voice AI & Public Solution Bulletin
            </p>
          </div>
        </div>

        {/* Portal Mode Switcher & Actions */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Main Dual Mode Selector */}
          <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => onViewModeChange('CITIZEN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'CITIZEN'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📱</span>
              <span>Public Citizen View</span>
            </button>

            <button
              onClick={() => onViewModeChange('GOVERNMENT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'GOVERNMENT'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏛️</span>
              <span>Government War Room</span>
            </button>
          </div>

          {/* Simulate Toll-Free Citizen Call Button */}
          <button
            onClick={onOpenIVRModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 border border-red-400/30 transition-all transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Call 1930 Hotline</span>
          </button>

          {/* Regional Language AI Classifier Selector */}
          <div className="relative flex items-center gap-1.5 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value as RegionalLanguage)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {OFFICIAL_REGIONAL_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
