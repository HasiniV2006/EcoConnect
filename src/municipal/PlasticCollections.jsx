import React, { useState } from 'react';
import {
  Scale,
  MapPin,
  Clock,
  User,
  BadgeCheck,
  Search,
  Filter,
  Truck,
} from 'lucide-react';
import VerifyWeightModal from './VerifyWeightModal';

const initialQueue = [
  {
    id: '#REQ-8841',
    citizenName: 'Sarah Jenkins',
    citizenId: '#98421',
    address: 'Apt 4B, Green Avenue',
    zone: 'Zone 4',
    estWeight: '5.0 kg',
    category: 'Hard Plastics',
    status: 'Pending Verification',
    scheduledTime: '10:30 AM',
  },
  {
    id: '#REQ-8902',
    citizenName: 'Raj Patel',
    citizenId: '#76832',
    address: '12 Maple Street',
    zone: 'Zone 4',
    estWeight: '3.2 kg',
    category: 'PET Bottles',
    status: 'Pending Verification',
    scheduledTime: '11:00 AM',
  },
  {
    id: '#REQ-8915',
    citizenName: 'Maria Santos',
    citizenId: '#54210',
    address: '8C, Orchid Towers',
    zone: 'Zone 4',
    estWeight: '2.8 kg',
    category: 'HDPE Containers',
    status: 'Verified',
    scheduledTime: '09:00 AM',
    verifiedWeight: '2.6 kg',
    creditsAwarded: 57,
  },
  {
    id: '#REQ-8920',
    citizenName: 'David Kim',
    citizenId: '#31987',
    address: '5A, Sunset Residency',
    zone: 'Zone 4',
    estWeight: '7.5 kg',
    category: 'Mixed Plastics',
    status: 'Pending Verification',
    scheduledTime: '12:00 PM',
  },
];

export default function PlasticCollections() {
  const [queue, setQueue] = useState(initialQueue);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenVerify = (req) => {
    setSelectedRequest(req);
    setModalOpen(true);
  };

  const handleVerify = (reqId, data) => {
    setQueue((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'Verified',
              verifiedWeight: `${data.measuredWeight} kg`,
              creditsAwarded: data.credits,
            }
          : r
      )
    );
  };

  const filtered = queue.filter(
    (r) =>
      r.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = queue.filter((r) => r.status === 'Pending Verification').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-800">Plastic Collections & Verification</h2>
          </div>
          <p className="text-sm text-slate-500">
            Collection Queue for Weighbridge Entry — Sorted by pickup schedule
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200/60">
            <Clock className="h-3 w-3" />
            {pendingCount} Pending
          </span>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Collection Queue Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Request ID
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Citizen Name & ID
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                  Address & Zone
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Est. Weight
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req, idx) => (
                <tr
                  key={req.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-blue-700 text-xs">
                      {req.id}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {req.scheduledTime}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
                        {req.citizenName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{req.citizenName}</p>
                        <p className="text-[10px] text-slate-400">{req.citizenId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-xs text-slate-600">{req.address}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {req.zone}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-xs tabular-nums">
                      {req.status === 'Verified' ? req.verifiedWeight : req.estWeight}
                    </span>
                    {req.status === 'Verified' && req.verifiedWeight !== req.estWeight && (
                      <div className="text-[10px] text-slate-400 line-through mt-0.5">
                        Est: {req.estWeight}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${
                        req.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                          : 'bg-amber-50 text-amber-700 ring-amber-200'
                      }`}
                    >
                      {req.status === 'Verified' && (
                        <BadgeCheck className="h-3 w-3" />
                      )}
                      {req.status}
                    </span>
                    {req.creditsAwarded && (
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        +{req.creditsAwarded} PTS
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {req.status === 'Pending Verification' ? (
                      <button
                        onClick={() => handleOpenVerify(req)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-[11px] font-bold text-white shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25 transition-all active:scale-[0.97]"
                      >
                        <Scale className="h-3.5 w-3.5" />
                        Verify Weight
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center justify-end gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Complete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verify Weight Modal */}
      <VerifyWeightModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onVerify={handleVerify}
      />
    </div>
  );
}
