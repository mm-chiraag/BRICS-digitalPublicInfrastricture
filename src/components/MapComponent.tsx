import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Complaint, SeverityLevel } from '../types';
import { AlertTriangle, MapPin, CheckCircle2, DollarSign, Users, Clock } from 'lucide-react';

interface MapComponentProps {
  complaints: Complaint[];
  selectedComplaintId?: string;
  onSelectComplaint?: (id: string) => void;
  onResolveComplaint?: (complaint: Complaint) => void;
  isGovernmentAdmin?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  onResolveComplaint,
  isGovernmentAdmin = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map centered at global BRICS region center or India default
      const map = L.map(mapContainerRef.current, {
        center: [20.0, 45.0], // Centered globally across BRICS
        zoom: 3,
        zoomControl: true,
      });

      // Use the public OSM raster layer; the previous CARTO endpoint now
      // returns an API-key-required placeholder instead of map tiles.
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    // Helper to pick color by severity
    const getSeverityColor = (severity: SeverityLevel) => {
      switch (severity) {
        case 'Critical': return '#ef4444'; // Red
        case 'Major': return '#f97316';    // Orange
        case 'Moderate': return '#eab308'; // Yellow
        case 'Minor': return '#22c55e';    // Green
        default: return '#3b82f6';
      }
    };

    complaints.forEach((complaint) => {
      if (!complaint.location?.lat || !complaint.location?.lng) return;

      const lat = complaint.location.lat;
      const lng = complaint.location.lng;
      bounds.extend([lat, lng]);

      const isSolved = complaint.status === 'Solved';
      const color = isSolved ? '#10b981' : getSeverityColor(complaint.severity);
      const isSelected = complaint.id === selectedComplaintId;

      // Custom DivIcon with count badge & pulse animation for critical issues
      const markerHtml = `
        <div style="position: relative; cursor: pointer;">
          <div style="
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            background-color: ${color};
            border: 3px solid #0f172a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 11px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: all 0.2s ease;
          ">
            ${complaint.complaintCount || 1}
          </div>
          ${complaint.severity === 'Critical' && !isSolved ? `
            <div style="
              position: absolute;
              top: -4px;
              left: -4px;
              width: ${isSelected ? '46px' : '40px'};
              height: ${isSelected ? '46px' : '40px'};
              border: 2px solid #ef4444;
              border-radius: 50%;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              opacity: 0.75;
              pointer-events: none;
            "></div>
          ` : ''}
          ${complaint.priorityRank ? `
            <div style="
              position: absolute;
              bottom: -6px;
              right: -6px;
              background-color: #0f172a;
              color: #f59e0b;
              border: 1px solid #f59e0b;
              font-size: 9px;
              font-weight: bold;
              padding: 1px 4px;
              border-radius: 8px;
            ">
              #${complaint.priorityRank}
            </div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-map-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Tooltip on Hover
      const tooltipContent = `
        <div class="p-2 max-w-xs font-sans text-xs">
          <div class="flex items-center justify-between gap-2 border-b border-slate-700/50 pb-1 mb-1">
            <span class="font-bold text-amber-400">#${complaint.priorityRank ? `Rank ${complaint.priorityRank}` : 'Ticket'}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style="background-color: ${color}">
              ${complaint.severity}
            </span>
          </div>
          <div class="font-semibold text-slate-100 text-sm mb-1">${complaint.title}</div>
          <div class="text-slate-300 mb-1">📍 ${complaint.location.address}, ${complaint.location.city} (${complaint.location.country})</div>
          <div class="text-slate-400 text-[11px] flex justify-between">
            <span>👥 Reports: ${complaint.complaintCount}</span>
            <span>💵 Est: ${complaint.costEstimate?.amountLocalCurrency || `$${complaint.costEstimate?.amountUSD}`}</span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        className: 'custom-leaflet-tooltip bg-slate-900 border border-slate-700 text-slate-100 rounded-lg shadow-xl',
        opacity: 0.95,
      });

      // Click event
      marker.on('click', () => {
        if (onSelectComplaint) {
          onSelectComplaint(complaint.id);
        }
      });

      markersRef.current[complaint.id] = marker;
    });

    // Fit bounds if complaints exist
    if (bounds.isValid() && complaints.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, [complaints, selectedComplaintId]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-xl text-slate-200 flex flex-col gap-2">
        <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider border-b border-slate-800 pb-1">
          Complaint Severity Hotspots
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-red-500 -ml-5 inline-block"></span>
            <span>Critical Emergency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
            <span>Major Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
            <span>Moderate Defect</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Solved / Minor</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1">
          💡 Numbers inside markers signify duplicate reports in same zone.
        </div>
      </div>
    </div>
  );
};
