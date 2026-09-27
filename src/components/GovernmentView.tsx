import React, { useState } from 'react';
import { Complaint, IssueCategory, SeverityLevel, GovernmentDepartment, SMSNotification } from '../types';
import { MapComponent } from './MapComponent';
import { WorkOrderModal } from './WorkOrderModal';
import { OFFICIAL_REGIONAL_LANGUAGES } from '../data/initialComplaints';
import { speakRegionalText, stopRegionalText } from '../utils/speech';
import { Shield, AlertTriangle, DollarSign, CheckCircle2, Flame, TrendingUp, Sparkles, Filter, Eye, Layers, ArrowUpDown, Check, MapPin, Phone, RefreshCcw, Building2, Smartphone, FileSpreadsheet, Search, FileText, Volume2, Play, Pause, BarChart3, Award, Users, Activity } from 'lucide-react';

interface GovernmentViewProps {
  complaints: Complaint[];
  allComplaints: Complaint[];
  smsNotifications: SMSNotification[];
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenResolveModal: (complaint: Complaint) => void;
  onAnalyzeCost: (complaint: Complaint) => void;
  onOpenIVRModal: () => void;
}

export const GovernmentView: React.FC<GovernmentViewProps> = ({
  complaints,
  allComplaints,
  smsNotifications,
  onSelectComplaint,
  onOpenResolveModal,
  onAnalyzeCost,
  onOpenIVRModal,
}) => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'ANALYTICS' | 'WORK_ORDERS'>('MAP');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | undefined>(complaints[0]?.id);
  const [workOrderComplaint, setWorkOrderComplaint] = useState<Complaint | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (selectedDepartment !== 'ALL' && c.assignedDepartment !== selectedDepartment) return false;
    if (selectedSeverity !== 'ALL' && c.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchTicket = c.ticketNumber.toLowerCase().includes(q);
      const matchCity = c.location.city.toLowerCase().includes(q);
      const matchDept = c.assignedDepartment.toLowerCase().includes(q);
      const matchState = (c.location.stateDistrict || '').toLowerCase().includes(q);
      if (!matchTitle && !matchTicket && !matchCity && !matchDept && !matchState) return false;
    }
    return true;
  });

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || filteredComplaints[0];

  // Calculate Metrics
  const totalActive = complaints.length;
  const criticalCount = complaints.filter((c) => c.severity === 'Critical').length;
  const totalReportsCount = complaints.reduce((acc, c) => acc + (c.complaintCount || 1), 0);
  const totalEstimatedUSD = complaints.reduce((acc, c) => acc + (c.costEstimate?.amountUSD || 0), 0);
  const solvedCount = allComplaints.filter((c) => c.status === 'Solved').length;

  const departmentsList: GovernmentDepartment[] = [
    'NHAI (Highways & Expressways)',
    'CPWD (Public Works Dept)',
    'Jal Board (Water & Sewage)',
    'Electricity Distribution Corp',
    'Metro & Mass Transit Corp',
    'Health Infrastructure Directorate',
    'Municipal Waste Management',
    'State Telecom & Digital Board',
    'Disaster Response Command'
  ];

  // TTS Audio synthesis for officer inspection
  const handlePlayTranscriptTTS = (text: string, langCode: string) => {
    if (isPlayingTTS) {
      stopRegionalText();
      setIsPlayingTTS(false);
      return;
    }

    speakRegionalText(
      text,
      langCode as any,
      () => setIsPlayingTTS(true),
      () => setIsPlayingTTS(false)
    );
  };

  // Export Cabinet CSV Briefing
  const handleExportCSV = () => {
    const headers = ['Ticket Number', 'Department', 'Severity', 'Title', 'City', 'State/District', 'Call Count', 'Budget USD', 'Budget Local', 'Status'];
    const rows = allComplaints.map((c) => [
      `"${c.ticketNumber}"`,
      `"${c.assignedDepartment}"`,
      `"${c.severity}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.location.city}"`,
      `"${c.location.stateDistrict || c.location.country}"`,
      c.complaintCount || 1,
      c.costEstimate?.amountUSD || 0,
      `"${c.costEstimate?.amountLocalCurrency || ''}"`,
      `"${c.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `National_Command_Cabinet_Briefing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Official Work Order Modal */}
      {workOrderComplaint && (
        <WorkOrderModal
          complaint={workOrderComplaint}
          onClose={() => setWorkOrderComplaint(null)}
        />
      )}

      {/* Command Operations Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                NATIONAL COMMAND & INTELLIGENCE CENTER
              </span>
              <span className="text-xs text-slate-400">Government Reference System</span>
            </div>
            <h2 className="text-2xl font-black font-display text-white mt-1 tracking-tight">
              Integrated Public Infrastructure Command Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Real-time monitoring of citizen call reports (Toll-Free 1930), 22 official regional language AI transcript analysis, dynamic priority score matrix, civil engineering budget calculation, and ministry dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Cabinet CSV</span>
            </button>

            <button
              onClick={onOpenIVRModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all border border-red-400/30"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>Receive 1930 Citizen Call</span>
            </button>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Priority Queue</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-display text-white mt-1">{totalActive}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Aggregating <span className="text-slate-200 font-semibold">{totalReportsCount}</span> citizen phone calls
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Critical Emergency Incidents</span>
              <Flame className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold font-display text-red-400 mt-1">{criticalCount}</div>
            <div className="text-[11px] text-red-300/80 mt-0.5">Rank #1 immediate intervention</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>AI Civil Works Budget</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
              ${(totalEstimatedUSD / 1000).toFixed(0)}k <span className="text-xs text-slate-400">USD</span>
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">Itemized engineering estimate</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Solved & SMS Notified</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold font-display text-teal-300 mt-1">{solvedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Automated citizen SMS alerts</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('MAP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'MAP'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>GIS Map & Live Priority Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ANALYTICS'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Ministry SLA & Regional Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('WORK_ORDERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'WORK_ORDERS'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official e-Tender Sanctions ({allComplaints.length})</span>
          </button>
        </div>

        {/* Global Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ticket, City, or Department..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* TAB 1: GIS Map & Priority Matrix */}
      {activeTab === 'MAP' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* GIS Hotspot Map */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold font-display text-white">
                        GIS National Infrastructure Hotspot Command Map
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Pins color-coded by severity. Numbers show call volume in hotspot area.
                      </p>
                    </div>
                  </div>

                  {/* Department & Severity Filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl text-[11px] px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="ALL">All Ministry Departments</option>
                      {departmentsList.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl text-[11px] px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="ALL">All Severities</option>
                      <option value="Critical">Critical</option>
                      <option value="Major">Major</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                </div>

                {/* Map Canvas */}
                <div className="h-[480px] w-full rounded-2xl overflow-hidden">
                  <MapComponent
                    complaints={filteredComplaints}
                    selectedComplaintId={selectedId}
                    onSelectComplaint={(id) => setSelectedId(id)}
                    onResolveComplaint={onOpenResolveModal}
                    isGovernmentAdmin={true}
                  />
                </div>
              </div>
            </div>

            {/* Selected Complaint Civil Engineering Inspector */}
            <div className="lg:col-span-5 space-y-4">
              {selectedComplaint ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 sticky top-24">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-xs border border-amber-500/30">
                        Priority Rank #{selectedComplaint.priorityRank || 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                        selectedComplaint.severity === 'Critical' ? 'bg-red-600' : selectedComplaint.severity === 'Major' ? 'bg-orange-600' : 'bg-amber-600'
                      }`}>
                        {selectedComplaint.severity}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">{selectedComplaint.ticketNumber}</span>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 mb-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{selectedComplaint.assignedDepartment}</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-display leading-tight">
                      {selectedComplaint.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Citizen Call Transcript & TTS Audio Playback */}
                  <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Caller Info:</span>
                      <span className="font-semibold text-slate-200">{selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Location & District:</span>
                      <span className="font-semibold text-slate-200">{selectedComplaint.location.address}, {selectedComplaint.location.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Citizen Call Volume:</span>
                      <span className="font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                        {selectedComplaint.complaintCount} Callers Logged
                      </span>
                    </div>

                    {selectedComplaint.voiceTranscript && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Regional Voice Call Transcript ({selectedComplaint.language.toUpperCase()}):</span>
                          </span>

                          <button
                            onClick={() => handlePlayTranscriptTTS(selectedComplaint.voiceTranscript!, selectedComplaint.language)}
                            className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            {isPlayingTTS ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            <span>{isPlayingTTS ? 'Stop' : '🔊 Hear Audio'}</span>
                          </button>
                        </div>

                        <p className="text-slate-200 italic font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                          "{selectedComplaint.voiceTranscript}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Engineering Budget Estimation */}
                  <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-800/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Engineering Budget & Tender Estimate</span>
                      </div>
                      <span className="text-xs font-black text-emerald-300">
                        {selectedComplaint.costEstimate.amountLocalCurrency}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 italic leading-snug">
                      "{selectedComplaint.costEstimate.justification}"
                    </p>

                    {/* Breakdown Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Materials & Concrete</span>
                        <span className="font-bold text-slate-200">${selectedComplaint.costEstimate.breakdown.materials.toLocaleString()} USD</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Labor & Crew</span>
                        <span className="font-bold text-slate-200">${selectedComplaint.costEstimate.breakdown.labor.toLocaleString()} USD</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Machinery & Crane</span>
                        <span className="font-bold text-slate-200">${selectedComplaint.costEstimate.breakdown.equipment.toLocaleString()} USD</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Target Repair Days</span>
                        <span className="font-bold text-emerald-400">{selectedComplaint.costEstimate.completionTimeDays} Days</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setWorkOrderComplaint(selectedComplaint)}
                        className="py-2 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Official e-Tender</span>
                      </button>

                      <button
                        onClick={() => onAnalyzeCost(selectedComplaint)}
                        className="py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Re-Calculate Budget</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button
                      onClick={() => onOpenResolveModal(selectedComplaint)}
                      className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Solved & Dispatch Citizen SMS Alert</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
                  Select an incident from the map or priority matrix to inspect engineering details.
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Priority Ranking Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold font-display text-white">
                    Dynamic Priority Ranking Matrix (Rank #1 Urgent → Lowest)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Algorithm Score = (Citizen Calls × 2.8) + (Severity Weight × 25) + (Hours Elapsed × 0.4). Re-calculated live on every incoming call.
                </p>
              </div>

              <div className="text-xs text-slate-300 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                Active Priority Queue: <span className="text-amber-400 font-bold">{filteredComplaints.length} Tickets</span>
              </div>
            </div>

            {/* Priority Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Ticket & Issue Title</th>
                    <th className="p-3">Ministry Department</th>
                    <th className="p-3">City & District</th>
                    <th className="p-3 text-center">Citizen Calls</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">AI Engineering Budget</th>
                    <th className="p-3 text-right">Dispatch Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredComplaints.map((c, index) => {
                    const isSelected = c.id === selectedId;
                    const isTopRank = (c.priorityRank || index + 1) === 1;

                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500'
                            : isTopRank
                            ? 'bg-red-950/20 hover:bg-red-950/40'
                            : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="p-3 font-mono font-bold">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
                            isTopRank
                              ? 'bg-red-600 text-white font-extrabold animate-bounce'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            #{c.priorityRank || index + 1}
                          </span>
                        </td>

                        <td className="p-3 font-mono text-amber-400 font-semibold">
                          {c.priorityScore || 50} pts
                        </td>

                        <td className="p-3 max-w-xs">
                          <div className="font-bold text-white truncate">{c.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.ticketNumber}</div>
                        </td>

                        <td className="p-3 font-medium text-indigo-300">
                          {c.assignedDepartment}
                        </td>

                        <td className="p-3">
                          <div className="text-slate-200">{c.location.city}</div>
                          <div className="text-[10px] text-slate-400">{c.location.stateDistrict || c.location.country}</div>
                        </td>

                        <td className="p-3 text-center font-bold">
                          <span className="px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {c.complaintCount} calls
                          </span>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                            c.severity === 'Critical' ? 'bg-red-600' : c.severity === 'Major' ? 'bg-orange-600' : 'bg-amber-600'
                          }`}>
                            {c.severity}
                          </span>
                        </td>

                        <td className="p-3 font-mono font-semibold text-emerald-400">
                          {c.costEstimate?.amountLocalCurrency || `$${c.costEstimate?.amountUSD}`}
                        </td>

                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWorkOrderComplaint(c);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-semibold"
                          >
                            Tender
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenResolveModal(c);
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                          >
                            Solve & SMS
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Ministry SLA & Regional Analytics */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
                <span>National SLA Compliance Rate</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 font-display">95.4%</div>
              <p className="text-[11px] text-slate-400">Average resolution turnaround: 4.2 calendar days</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
                <span>22 Official Languages Served</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-indigo-400 font-display">100% Speech Acc</div>
              <p className="text-[11px] text-slate-400">Zero language barriers across Indian states</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
                <span>Total Civil Budget Sanctioned</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-display">₹3.42 Crore</div>
              <p className="text-[11px] text-slate-400">Itemized line-item engineering estimates</p>
            </div>
          </div>

          {/* Language Breakdown Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Regional Language Call Volume Breakdown (Line 1930)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {OFFICIAL_REGIONAL_LANGUAGES.slice(0, 12).map((lang, idx) => {
                const count = allComplaints.filter((c) => c.language === lang.code).length + (idx % 3);
                return (
                  <div key={lang.code} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-center space-y-1">
                    <div className="text-2xl">{lang.flag}</div>
                    <div className="text-xs font-bold text-white">{lang.name}</div>
                    <div className="text-[11px] font-mono text-indigo-400">{count} Calls Logged</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Official e-Tender Sanctions Repository */}
      {activeTab === 'WORK_ORDERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Official e-Tender & Emergency Work Orders Repository</span>
              </h3>
              <p className="text-xs text-slate-400">Click any ticket to generate and print the official government letterhead sanction document.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allComplaints.map((c) => (
              <div
                key={c.id}
                onClick={() => setWorkOrderComplaint(c)}
                className="bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-mono text-indigo-400 font-bold">{c.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold text-[10px]">
                    {c.assignedDepartment}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{c.costEstimate.amountLocalCurrency}</span>
                  <span className="text-[11px] font-bold text-indigo-400 group-hover:underline">View e-Tender →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automated Citizen SMS Dispatches Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold font-display text-white">Automated Citizen SMS Dispatches Log</h3>
              <p className="text-xs text-slate-400">Audit trail of SMS alerts sent to citizens upon government issue resolution.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800">
            {smsNotifications.length} Dispatched
          </span>
        </div>

        {smsNotifications.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No SMS dispatches yet. Resolve a ticket in the matrix above to dispatch automated citizen SMS alerts!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smsNotifications.map((sms) => (
              <div key={sms.id} className="bg-slate-950 border border-emerald-800/40 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                  <span className="font-bold">📱 {sms.recipientName} ({sms.recipientPhone})</span>
                  <span className="text-[10px] text-slate-400">{new Date(sms.sentAt).toLocaleTimeString()}</span>
                </div>
                <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/50 text-[11px] text-slate-100 font-mono leading-relaxed">
                  {sms.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
