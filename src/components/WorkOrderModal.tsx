import React from 'react';
import { Complaint } from '../types';
import { Shield, Printer, Download, CheckCircle, FileText, Building2, Calendar, DollarSign, Award, Lock, Stamp } from 'lucide-react';

interface WorkOrderModalProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ complaint, onClose }) => {
  if (!complaint) return null;

  const handlePrint = () => {
    window.print();
  };

  const tenderNo = complaint.costEstimate.tenderCode || `NDPI-TND-2026-${complaint.ticketNumber.replace('NDPI-1930-', '')}`;
  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200 my-8">
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-white font-display">
              Official Government Emergency Work Order & Sanction Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export Document</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 text-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Official Printable Government Letterhead */}
        <div className="p-8 bg-slate-950 text-slate-100 font-sans space-y-6 printable-area">
          {/* Header Seal */}
          <div className="border-b-2 border-indigo-500 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/40 text-indigo-300">
                <Shield className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-sm font-black text-indigo-300 tracking-wider uppercase font-display">
                  Government of India • Ministry of Road Transport & Public Works
                </h1>
                <h2 className="text-lg font-bold text-white font-display">
                  National Public Infrastructure Command & Intelligence Directorate
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  Digital Public Infrastructure (DPI) Sanction Order No: {tenderNo}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/40 inline-block mb-1">
                FAST-TRACK EMERGENCY SANCTION
              </span>
              <div className="text-slate-400 text-[10px]">Date Issued: {orderDate}</div>
              <div className="text-slate-400 text-[10px]">Toll-Free Origin: Line 1930</div>
            </div>
          </div>

          {/* Issue Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">{complaint.assignedDepartment}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Grievance Ticket: {complaint.ticketNumber}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{complaint.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{complaint.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 font-mono text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">LOCATION / LANDMARK</span>
                <span className="font-semibold text-white">{complaint.location.address}, {complaint.location.city}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">STATE / DISTRICT</span>
                <span className="font-semibold text-white">{complaint.location.stateDistrict || complaint.location.country}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">CITIZEN CALL VOLUME</span>
                <span className="font-bold text-amber-400">{complaint.complaintCount} Toll-Free Callers</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">NATIONAL PRIORITY</span>
                <span className="font-bold text-red-400">Rank #{complaint.priorityRank || 1} ({complaint.severity})</span>
              </div>
            </div>
          </div>

          {/* AI Civil Engineering Financial Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Approved Line-Item Civil Engineering Financial Estimate</span>
            </h4>

            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Expense Head</th>
                  <th className="p-3">Technical Description</th>
                  <th className="p-3 text-right">Approved Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                <tr>
                  <td className="p-3 font-semibold text-white">Materials & Structural Components</td>
                  <td className="p-3 text-slate-400 font-sans text-[11px]">Cement, high-grade steel, aggregate, specialized piping & valves</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">${complaint.costEstimate.breakdown.materials.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Skilled Engineering & Labor Force</td>
                  <td className="p-3 text-slate-400 font-sans text-[11px]">24/7 emergency repair crew, civil engineers, safety inspectors</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">${complaint.costEstimate.breakdown.labor.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Heavy Machinery & Crane Deployment</td>
                  <td className="p-3 text-slate-400 font-sans text-[11px]">Hydraulic cranes, trenchless excavators, jetting pumps, generators</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">${complaint.costEstimate.breakdown.equipment.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Contingency & Emergency Reserves</td>
                  <td className="p-3 text-slate-400 font-sans text-[11px]">Traffic diversions, safety barriers, environmental protection</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">${complaint.costEstimate.breakdown.contingency.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-900/80 text-sm font-bold">
                  <td className="p-3 text-indigo-300 font-sans">TOTAL SANCTIONED BUDGET</td>
                  <td className="p-3 text-slate-300 font-sans text-xs">Target Completion SLA: {complaint.costEstimate.completionTimeDays} Calendar Days</td>
                  <td className="p-3 text-right text-emerald-300">{complaint.costEstimate.amountLocalCurrency} (${complaint.costEstimate.amountUSD.toLocaleString()} USD)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Technical Justification */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-2xl space-y-1 text-xs">
            <span className="font-bold text-indigo-300 text-[11px]">Civil Engineering Technical Justification:</span>
            <p className="text-slate-300 italic text-[11px] leading-relaxed">
              "{complaint.costEstimate.justification}"
            </p>
          </div>

          {/* Terms & Digital Signature Stamp */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-300">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>CRYPTOGRAPHIC GOVT SECURITY CLEARANCE</span>
              </div>
              <p>This document is digitally validated under the National Digital Public Infrastructure (DPI) Act. Unauthorized modification is strictly prohibited.</p>
            </div>

            {/* Official Stamp Box */}
            <div className="border-2 border-indigo-500/50 rounded-2xl p-3 bg-gradient-to-r from-slate-900 to-indigo-950/80 text-center space-y-1 relative">
              <div className="absolute top-2 right-2 text-indigo-400 opacity-20">
                <Stamp className="w-8 h-8" />
              </div>
              <div className="text-[10px] font-bold tracking-widest text-indigo-300 uppercase">
                NATIONAL PUBLIC WORKS GOVERNANCE
              </div>
              <div className="text-xs font-black text-white font-mono">
                APPROVED & SANCTIONED
              </div>
              <div className="text-[10px] text-slate-400 italic">
                Digital Signature Hash: 0x89F4...NDPI1930
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
