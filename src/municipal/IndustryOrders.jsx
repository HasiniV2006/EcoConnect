import React, { useState, useEffect } from 'react';
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
import { api } from '../api/client';

export default function IndustryOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null); // { order, action: 'Approve' | 'Deny' }
  const [toastMessage, setToastMessage] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api.municipality
      .getPurchaseRequests()
      .then((res) => {
        if (res?.orders) {
          const mapped = res.orders.map((o) => ({
            _id: o._id,
            id: o.id,
            industryName: o.company || 'Industry Partner',
            plasticType: o.polymer,
            quantity: o.quantity || `${o.quantityKg} kg`,
            status: o.status === 'Approved' ? 'Approved' : o.status === 'Rejected' ? 'Denied' : 'Pending',
            rate: o.rate,
            total: o.total,
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => console.warn('Could not load industry orders:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenConfirm = (order, action) => {
    setConfirmDialog({ order, action });
  };

  const handleCloseConfirm = () => {
    setConfirmDialog(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    const { order, action } = confirmDialog;

    try {
      if (action === 'Approve') {
        const res = await api.municipality.approveOrder(order._id);
        setToastMessage(res.message || `Order ${order.id} approved and dispatched!`);
      } else {
        const res = await api.municipality.rejectOrder(order._id, 'Municipal stock unavailable');
        setToastMessage(res.message || `Order ${order.id} rejected.`);
      }
      setTimeout(() => setToastMessage(null), 4000);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      // Fallback local update
      const newStatus = action === 'Approve' ? 'Approved' : 'Denied';
      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id ? { ...item, status: newStatus } : item
        )
      );
    }

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
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[120] max-w-md animate-slide-up rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-blue-500/50 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

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
        {loading && orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading industry purchase requests...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No industry orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    Order ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    Industry Buyer
                  </th>
                  <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    Plastic Polymer
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
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25 transition-all active:scale-[0.97] cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenConfirm(order, 'Deny')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-700 transition-all active:scale-[0.97] cursor-pointer"
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
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  confirmDialog.action === 'Approve'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {confirmDialog.action} Order?
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {confirmDialog.order.id} • {confirmDialog.order.industryName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {confirmDialog.action === 'Approve'
                ? `Confirming this order will deduct ${confirmDialog.order.quantity} of ${confirmDialog.order.plasticType} from municipal inventory and initiate shipment tracking.`
                : `Are you sure you want to deny this request from ${confirmDialog.order.industryName}?`}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCloseConfirm}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer ${
                  confirmDialog.action === 'Approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                Confirm {confirmDialog.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
