import React, { useState, useEffect } from 'react';
import { RegionalLanguage, Complaint, SMSNotification } from './types';
import { UnifiedGoverningPortal } from './components/UnifiedGoverningPortal';
import { IVRCallModal } from './components/IVRCallModal';
import { ResolutionModal } from './components/ResolutionModal';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<RegionalLanguage>('hi');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [smsNotifications, setSmsNotifications] = useState<SMSNotification[]>([]);
  const [isIVRModalOpen, setIsIVRModalOpen] = useState(false);
  const [resolvingComplaint, setResolvingComplaint] = useState<Complaint | null>(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
        setAllComplaints(data.allComplaints || []);
        setSmsNotifications(data.smsNotifications || []);
      }
    } catch (e) {
      console.error('Failed to fetch complaints:', e);
    }
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 5000); // Live polling every 5s
    return () => clearInterval(interval);
  }, []);

  const handleResetData = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await fetchComplaints();
        alert('Dataset reseeded with authentic national infrastructure data.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmResolve = async (id: string, resolutionNotes: string, officerName: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolutionNotes,
          officerName,
          assignedDepartment: resolvingComplaint?.assignedDepartment
        })
      });

      if (res.ok) {
        setResolvingComplaint(null);
        await fetchComplaints();
      }
    } catch (e) {
      console.error('Error resolving complaint:', e);
    }
  };

  const handleSanctionWorkOrder = async (complaint: Complaint) => {
    try {
      const res = await fetch(`/api/complaints/${complaint.id}/sanction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerName: 'Senior Chief Civil Engineer',
          customNotes: complaint.costEstimate.justification
        })
      });

      if (res.ok) {
        await fetchComplaints();
        alert(`Government Work Order #${complaint.ticketNumber} officially SANCTIONED!\nPublic Solution Bulletin & Citizen SMS alerts dispatched.`);
      }
    } catch (e) {
      console.error('Error sanctioning work order:', e);
    }
  };

  const handleAnalyzeCost = async (complaint: Complaint) => {
    try {
      const res = await fetch('/api/gemini/estimate-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.costEstimate) {
          complaint.costEstimate = data.costEstimate;
          setComplaints([...complaints]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Main Unified Governing Portal */}
      <UnifiedGoverningPortal
        complaints={complaints}
        allComplaints={allComplaints}
        smsNotifications={smsNotifications}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onOpenIVRModal={() => setIsIVRModalOpen(true)}
        onSanctionWorkOrder={handleSanctionWorkOrder}
        onResolveComplaint={(c) => setResolvingComplaint(c)}
        onAnalyzeCost={handleAnalyzeCost}
        onResetData={handleResetData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs py-4 px-6 text-center">
        <p className="max-w-4xl mx-auto">
          National Public Infrastructure Command System • Digital Public Infrastructure (DPI) • Official Reference Model
        </p>
      </footer>

      {/* Incoming 1930 Call Simulator & Resolution Modals */}
      <IVRCallModal
        isOpen={isIVRModalOpen}
        onClose={() => setIsIVRModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onComplaintCreated={() => fetchComplaints()}
      />

      <ResolutionModal
        complaint={resolvingComplaint}
        onClose={() => setResolvingComplaint(null)}
        onConfirmResolve={handleConfirmResolve}
      />
    </div>
  );
}

