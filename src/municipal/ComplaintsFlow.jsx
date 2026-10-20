import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Clock,
  Eye,
  UserPlus,
  CheckCircle2,
  Search,
  Filter,
  MessageSquareWarning,
  Image as ImageIcon,
} from 'lucide-react';
import AssignTeamModal from './AssignTeamModal';

const initialComplaints = [
  {
    id: '#CIV-9012',
    title: 'Deep Pothole on Main Market Road',
    category: 'Pothole / Road Damage',
    location: 'Sector 14, Near Metro Pillar #42',
    locationShort: 'Main Market Road',
    description:
      'Hazardous deep hole causing vehicle damage and posing risk to two-wheelers. Multiple residents have reported near-accidents at this location during evening hours.',
    reportedTime: '2 days ago',
    severity: 'High',
    status: 'Unassigned',
    assignedTeam: null,
    imageUrl: null,
  },
  {
    id: '#CIV-9018',
    title: 'Broken Streetlights Cluster',
    category: 'Electrical / Lighting',
    location: 'Avenue 9, Block C',
    locationShort: 'Avenue 9',
    description:
      'A cluster of 5 streetlights have been non-functional for over a week. Residents have reported safety concerns during nighttime hours in the area.',
    reportedTime: '5 days ago',
    severity: 'Medium',
    status: 'Assigned',
    assignedTeam: 'Electrical Squad B',
    imageUrl: null,
  },
  {
    id: '#CIV-9025',
    title: 'Overflowing Drain Near Park Entrance',
    category: 'Drainage & Sewage',
    location: 'Sector 14, Green Park Gate #2',
    locationShort: 'Green Park',
    description:
      'Storm drain near the main park entrance is overflowing and causing waterlogging on the pedestrian path. Foul smell reported by morning walkers.',
    reportedTime: '1 day ago',
    severity: 'High',
    status: 'Unassigned',
    assignedTeam: null,
    imageUrl: null,
  },
];

export default function ComplaintsFlow() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleAssign = (complaintId, team) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, status: 'Assigned', assignedTeam: team }
          : c
      )
    );
  };

  const filtered = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareWarning className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-black text-slate-800">Citizen Complaints</h2>
          </div>
          <p className="text-sm text-slate-500">
            Active civic issues reported by citizens. Assign teams and track resolution.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search complaints…"
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((complaint, idx) => (
          <div
            key={complaint.id}
            className={`card-hover group relative overflow-hidden rounded-2xl bg-white border shadow-sm stagger-${idx + 1} ${
              complaint.severity === 'High'
                ? 'border-red-200/80'
                : 'border-slate-200/80'
            }`}
            style={{ animationFillMode: 'both' }}
          >
            {/* Severity Strip */}
            <div
              className={`h-1 w-full ${
                complaint.severity === 'High'
                  ? 'bg-gradient-to-r from-red-500 to-rose-500'
                  : complaint.severity === 'Medium'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
            />

            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                {/* Top Row: ID, Status, Severity */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 rounded-full px-2.5 py-0.5 ring-1 ring-blue-200/60">
                    {complaint.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ring-1 ${
                        complaint.severity === 'High'
                          ? 'bg-red-50 text-red-700 ring-red-200'
                          : complaint.severity === 'Medium'
                          ? 'bg-amber-50 text-amber-700 ring-amber-200'
                          : 'bg-green-50 text-green-700 ring-green-200'
                      }`}
                    >
                      {complaint.severity}
                    </span>
                    <span
                      className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ring-1 ${
                        complaint.status === 'Unassigned'
                          ? 'bg-slate-100 text-slate-600 ring-slate-200'
                          : 'bg-blue-50 text-blue-700 ring-blue-200'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>

                {/* Side-by-side layout: Image beside details */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Reported Issue Image / Placeholder */}
                  <div className="shrink-0 w-full sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {complaint.imageUrl ? (
                      <img
                        src={complaint.imageUrl}
                        alt={complaint.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-slate-400 text-center">
                        <ImageIcon className="h-5 w-5 text-slate-400" />
                        <span className="text-[10px] font-medium leading-tight">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Complaint Details */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {complaint.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {complaint.description}
                    </p>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        {complaint.locationShort}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {complaint.reportedTime}
                      </span>
                      {complaint.assignedTeam && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          {complaint.assignedTeam}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {complaint.status === 'Unassigned' ? (
                <button
                  onClick={() => handleOpenAssign(complaint)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 transition-all active:scale-[0.97]"
                >
                  <UserPlus className="h-4 w-4" />
                  Check Details & Assign Team
                </button>
              ) : (
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all">
                  <Eye className="h-4 w-4" />
                  Review Evidence & Verify Resolution
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Team Modal */}
      <AssignTeamModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onAssign={handleAssign}
      />
    </div>
  );
}
