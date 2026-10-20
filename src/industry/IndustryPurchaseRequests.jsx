import React, { useState } from 'react';
import {
  FileText,
  Search,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

const initialRequests = [
  { id: 'PR-1045', batch: 'BT-4018', municipality: 'Zone 2 Municipal Corp', quantity: 500, estimatedCost: '₹22,420', date: 'Oct 18, 2026', status: 'Approved' },
  { id: 'PR-1044', batch: 'BT-4021', municipality: 'Zone 4 Municipal Corp', quantity: 280, estimatedCost: '₹13,860', date: 'Oct 17, 2026', status: 'Pending' },
  { id: 'PR-1042', batch: 'BT-4012', municipality: 'Zone 1 Municipal Corp', quantity: 180, estimatedCost: '₹6,372', date: 'Oct 15, 2026', status: 'Pending' },
  { id: 'PR-1040', batch: 'BT-4009', municipality: 'Zone 3 Municipal Corp', quantity: 640, estimatedCost: '₹30,208', date: 'Oct 12, 2026', status: 'Approved' },
  { id: 'PR-1038', batch: 'BT-4006', municipality: 'Zone 1 Municipal Corp', quantity: 200, estimatedCost: '₹10,384', date: 'Oct 10, 2026', status: 'Rejected' },
  { id: 'PR-1035', batch: 'BT-4015', municipality: 'Zone 4 Municipal Corp', quantity: 350, estimatedCost: '₹14,455', date: 'Oct 08, 2026', status: 'Approved' },
];

export default function IndustryPurchaseRequests() {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = initialRequests.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (searchTerm && !r.id.toLowerCase().includes(searchTerm.toLowerCase()) && !r.batch.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const statusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 ring-1 ring-amber-300/80">
            <CheckCircle2 className="h-3 w-3 text-amber-700" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-black text-slate-800">Purchase Requests</h2>
          </div>
          <p className="text-sm text-slate-500">
            Track and manage your plastic procurement requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none rounded-lg bg-white border border-slate-200 pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm cursor-pointer">
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Batch</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Municipality</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Quantity (kg)</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Estimated Cost</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Date</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-amber-800 text-xs">{req.batch}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{req.id}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-600">{req.municipality}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-xs tabular-nums">{req.quantity} kg</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-xs tabular-nums">{req.estimatedCost}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{req.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    {statusBadge(req.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
