import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  AlertCircle,
  Building2,
} from 'lucide-react';

// Clearly identified demonstration data for UI prototype
const demonstrationOrders = [
  {
    id: 'IND-1001',
    industryName: 'Green Polymer Industries',
    plasticType: 'PET',
    quantity: '500 kg',
    status: 'Pending',
  },
  {
    id: 'IND-1002',
    industryName: 'EcoPlast Manufacturing Ltd',
    plasticType: 'HDPE',
    quantity: '1,200 kg',
    status: 'Pending',
  },
  {
    id: 'IND-1003',
    industryName: 'Circular Dynamics Corp',
    plasticType: 'PP',
    quantity: '750 kg',
    status: 'Approved',
  },
  {
    id: 'IND-1004',
    industryName: 'Apex Recycled Polymers',
    plasticType: 'LDPE',
    quantity: '400 kg',
    status: 'Denied',
  },
  {
    id: 'IND-1005',
    industryName: 'CleanCycle Packaging Co',
    plasticType: 'PET',
    quantity: '650 kg',
    status: 'Pending',
  },
];

export default function IndustryOrders() {
  const [orders, setOrders] = useState(demonstrationOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null); // { order, action: 'Approve' | 'Deny' }

  const handleOpenConfirm = (order, action) => {
    setConfirmDialog({ order, action });
  };

  const handleCloseConfirm = () => {
    setConfirmDialog(null);
  };

  const handleConfirmAction = () => {
    if (!confirmDialog) return;
    const { order, action } = confirmDialog;
    const newStatus = action === 'Approve' ? 'Approved' : 'Denied';

    setOrders((prev) =>
      prev.map((item) =>
        item.id === order.id ? { ...item, status: newStatus } : item
      )
    );
    setConfirmDialog(null);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.industryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.plasticType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-black text-slate-800">Industry Orders</h2>
          </div>
          <p className="text-sm text-slate-500">
            Review industry requests for recycled plastic materials.
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
              placeholder="Search orders…"
              className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Industry ID
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Industry Name
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Plastic Type Required
                </th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Quantity Required
                </th>
                <th className="px-5 py-3.5 text-right text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {/* 1. Industry ID */}
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-blue-700 text-xs">
                      {order.id}
                    </span>
                  </td>

                  {/* 2. Industry Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 text-xs font-bold shrink-0 ring-1 ring-blue-200/60">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">
                        {order.industryName}
                      </span>
                    </div>
                  </td>

                  {/* 3. Plastic Type Required */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200">
                      {order.plasticType}
                    </span>
                  </td>

                  {/* 4. Quantity Required */}
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-xs tabular-nums">
                      {order.quantity}
                    </span>
                  </td>

                  {/* 5. Action */}
                  <td className="px-5 py-4 text-right">
                    {order.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenConfirm(order, 'Approve')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25 transition-all active:scale-[0.97]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleOpenConfirm(order, 'Deny')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-all active:scale-[0.97]"
                        >
                          <X className="h-3.5 w-3.5" />
                          Deny
                        </button>
                      </div>
                    ) : order.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-200">
                        <XCircle className="h-3 w-3" />
                        Denied
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleCloseConfirm}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200/80 animate-scale-in overflow-hidden">
            {/* Header */}
            <div
              className={`relative px-6 py-5 text-white ${
                confirmDialog.action === 'Approve'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                  : 'bg-gradient-to-r from-rose-600 to-red-600'
              }`}
            >
              <button
                onClick={handleCloseConfirm}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1">
                Order Confirmation
              </p>
              <h3 className="text-lg font-black">
                {confirmDialog.action === 'Approve'
                  ? 'Confirm Order Approval'
                  : 'Confirm Order Denial'}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Are you sure you want to{' '}
                <strong className={confirmDialog.action === 'Approve' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                  {confirmDialog.action.toLowerCase()}
                </strong>{' '}
                the following industry recycled material request?
              </p>

              {/* Order Info Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Industry ID:</span>
                  <span className="font-mono font-bold text-blue-700">{confirmDialog.order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Industry Name:</span>
                  <span className="font-semibold text-slate-800">{confirmDialog.order.industryName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Plastic Type:</span>
                  <span className="font-semibold text-slate-800">{confirmDialog.order.plasticType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Quantity:</span>
                  <span className="font-bold text-slate-800">{confirmDialog.order.quantity}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
              <button
                onClick={handleCloseConfirm}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.97] ${
                  confirmDialog.action === 'Approve'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-600/25 hover:shadow-xl hover:shadow-rose-600/30'
                }`}
              >
                {confirmDialog.action === 'Approve' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm Approval
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Confirm Denial
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
