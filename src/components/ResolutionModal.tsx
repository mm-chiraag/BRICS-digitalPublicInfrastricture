import React, { useState } from 'react';
import { Complaint } from '../types';
import { CheckCircle2, Send, Smartphone, Building2, Sparkles } from 'lucide-react';

interface ResolutionModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onConfirmResolve: (id: string, resolutionNotes: string, officerName: string) => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  complaint,
  onClose,
  onConfirmResolve,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('National Public Works field engineering unit repaired defect and restored full public service.');
  const [officerName, setOfficerName] = useState('National Public Works Command Officer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!complaint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onConfirmResolve(complaint.id, resolutionNotes, officerName);
    setIsSubmitting(false);
    onClose();
  };

  const previewSms = `[NATIONAL GOVERNMENT DPI ALERT - 1930] Dear ${complaint.citizenName}, your public grievance report #${complaint.ticketNumber} regarding "${complaint.title}" in ${complaint.location.city} has been SOLVED by ${complaint.assignedDepartment || 'Government Authority'}. Resolution Details: ${resolutionNotes}. Thank you for contributing to national infrastructure safety.`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Resolve Infrastructure Ticket & Send SMS</h3>
              <p className="text-xs text-slate-400">Ticket: {complaint.ticketNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1">
            <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{complaint.assignedDepartment}</span>
            </div>
            <div className="font-bold text-slate-200">{complaint.title}</div>
            <div className="text-slate-400">📍 {complaint.location.address}, {complaint.location.city} ({complaint.location.stateDistrict || complaint.location.country})</div>
            <div className="text-amber-400 font-semibold">Priority Score: {complaint.priorityScore || 50} pts (Rank #{complaint.priorityRank || 1})</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Government Officer / Department Official</label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Civil Work Resolution Summary</label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          {/* SMS Live Preview */}
          <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Smartphone className="w-4 h-4" />
              <span>Automated Citizen SMS Alert Preview:</span>
            </div>
            <p className="text-[11px] text-slate-200 font-mono italic">{previewSms}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Solve, Dispatch SMS & Remove from Priority Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
