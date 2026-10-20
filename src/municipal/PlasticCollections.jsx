import React, { useState, useEffect } from 'react';
import {
  Scale,
  MapPin,
  Clock,
  User,
  BadgeCheck,
  Search,
  Filter,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import VerifyWeightModal from './VerifyWeightModal';
import { api } from '../api/client';

export default function PlasticCollections() {
  const [queue, setQueue] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState(null);

  const fetchQueue = () => {
    setLoading(true);
    api.pickups
      .getAll()
      .then((res) => {
        if (res?.pickups) {
          setQueue(res.pickups);
        }
      })
      .catch((err) => console.warn('Could not load collections queue:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleOpenVerify = (req) => {
    setSelectedRequest(req);
    setModalOpen(true);
  };

  const handleVerify = async (requestId, payload) => {
    try {
      const res = await api.pickups.verify(requestId, payload);
      setSuccessToast(res.message || 'Weight verified and credits awarded!');
      setTimeout(() => setSuccessToast(null), 4000);
      fetchQueue();
    } catch (err) {
      console.error('Failed to verify pickup weight:', err);
    }
  };

  const filtered = queue.filter(
    (item) =>
      item.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[120] max-w-md animate-slide-up rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-emerald-500/50 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-semibold">{successToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-800">Plastic Pickup Queue</h2>
          </div>
          <p className="text-sm text-slate-500">
            Incoming citizen collections requiring verification, scale weighing, and credit disbursement.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search citizen or ID…"
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        {loading && queue.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading pickup queue...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No pickup requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Request ID</th>
                  <th className="px-5 py-4">Citizen & Address</th>
                  <th className="px-5 py-4">Date & Slot</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Verified Weight</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-blue-700">{item.id}</td>
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.citizen}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{item.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.date} ({item.slot || 'Morning'})</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${
                          item.verified || item.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-amber-50 text-amber-700 ring-amber-200'
                        }`}
                      >
                        {item.verified || item.status === 'Verified' ? 'Verified & Credited' : 'Pending Weighing'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">
                        {item.weight || item.verifiedWeight || 'Awaiting scale'}
                      </div>
                      {item.reward && (
                        <span className="text-[10px] font-bold text-emerald-600">{item.reward}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {item.verified || item.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <BadgeCheck className="h-4 w-4" />
                          Complete
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenVerify(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.97] cursor-pointer"
                        >
                          <Scale className="h-3.5 w-3.5" />
                          Weigh & Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verify Weight Modal */}
      <VerifyWeightModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        request={selectedRequest}
        onVerify={handleVerify}
      />
    </div>
  );
}
