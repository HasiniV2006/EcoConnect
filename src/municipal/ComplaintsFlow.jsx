import React, { useState, useEffect } from 'react';
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
import { api } from '../api/client';

export default function ComplaintsFlow() {
  const [complaints, setComplaints] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComplaints = () => {
    setLoading(true);
    api.complaints
      .getAll()
      .then((res) => {
        if (res?.complaints) {
          const formatted = res.complaints.map((c) => ({
            _id: c._id,
            id: c.id,
            title: c.title,
            category: c.category,
            location: c.location,
            locationShort: c.location.split(',')[0],
            description: c.description,
            reportedTime: new Date(c.createdAt).toLocaleDateString(),
            severity: c.priority || 'Medium',
            status: c.status === 'Assigned' || c.status === 'In Progress' ? 'Assigned' : c.status === 'Resolved' ? 'Resolved' : 'Unassigned',
            assignedTeam: c.assignedTeam !== 'Unassigned' ? c.assignedTeam : null,
            imageUrl: c.photoUrl,
            citizen: c.citizen,
            citizenPhone: c.citizenPhone,
          }));
          setComplaints(formatted);
        }
      })
      .catch((err) => console.warn('Could not load municipal complaints:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleOpenAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleAssign = async (complaintId, team) => {
    try {
      const complaintToUpdate = complaints.find((c) => c.id === complaintId || c._id === complaintId);
      if (complaintToUpdate?._id) {
        await api.complaints.assign(complaintToUpdate._id, team);
      }
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId || c._id === complaintId
            ? { ...c, status: 'Assigned', assignedTeam: team }
            : c
        )
      );
      fetchComplaints();
    } catch (err) {
      console.error('Failed to assign team:', err);
    }
  };

  const filtered = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
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

      {loading && complaints.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading complaints from database...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">No complaints found.</div>
      ) : (
        /* Complaints Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((complaint, idx) => (
            <div
              key={complaint.id || idx}
              className={`card-hover group relative overflow-hidden rounded-2xl bg-white border shadow-sm ${
                complaint.severity === 'High' || complaint.severity === 'Critical'
                  ? 'border-red-200/80'
                  : 'border-slate-200/80'
              }`}
            >
              {/* Severity Strip */}
              <div
                className={`h-1 w-full ${
                  complaint.severity === 'High' || complaint.severity === 'Critical'
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
                          complaint.severity === 'High' || complaint.severity === 'Critical'
                            ? 'bg-red-50 text-red-700 ring-red-200'
                            : complaint.severity === 'Medium'
                            ? 'bg-amber-50 text-amber-700 ring-amber-200'
                            : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        }`}
                      >
                        {complaint.severity} Priority
                      </span>
                      <span
                        className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ring-1 ${
                          complaint.status === 'Assigned'
                            ? 'bg-blue-50 text-blue-700 ring-blue-200'
                            : complaint.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-slate-100 text-slate-600 ring-slate-200'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {complaint.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                      {complaint.category}
                    </span>
                    <span>•</span>
                    <span>{complaint.reportedTime}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 bg-slate-50 rounded-lg px-2.5 py-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{complaint.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {complaint.description}
                  </p>
                </div>

                {/* Bottom Row: Assigned Team / Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {complaint.assignedTeam ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>{complaint.assignedTeam}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No team assigned</span>
                  )}

                  <button
                    onClick={() => handleOpenAssign(complaint)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.97] cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {complaint.assignedTeam ? 'Reassign Team' : 'Assign Team'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Team Modal */}
      <AssignTeamModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        complaint={selectedComplaint}
        onAssign={handleAssign}
      />
    </div>
  );
}
