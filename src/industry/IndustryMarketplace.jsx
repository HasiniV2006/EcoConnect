import React, { useState } from 'react';
import {
  Store,
  Search,
  Filter,
  Eye,
  X,
  ChevronDown,
  IndianRupee,
  FileText,
  Truck,
  Package,
} from 'lucide-react';

const batches = [
  { id: 'BT-4021', type: 'HDPE', municipality: 'Zone 4 Municipal Corp', available: 280, price: 42, quality: 'Grade A' },
  { id: 'BT-4018', type: 'PET', municipality: 'Zone 2 Municipal Corp', available: 520, price: 38, quality: 'Grade A' },
  { id: 'BT-4015', type: 'PP', municipality: 'Zone 4 Municipal Corp', available: 350, price: 35, quality: 'Grade B' },
  { id: 'BT-4012', type: 'LDPE', municipality: 'Zone 1 Municipal Corp', available: 180, price: 30, quality: 'Grade B' },
  { id: 'BT-4009', type: 'PET', municipality: 'Zone 3 Municipal Corp', available: 640, price: 40, quality: 'Grade A' },
  { id: 'BT-4006', type: 'HDPE', municipality: 'Zone 1 Municipal Corp', available: 420, price: 44, quality: 'Grade A' },
];

export default function IndustryMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [muniFilter, setMuniFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inspectBatch, setInspectBatch] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState('');

  const filtered = batches.filter((b) => {
    if (searchTerm && !b.id.toLowerCase().includes(searchTerm.toLowerCase()) && !b.type.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (typeFilter && b.type !== typeFilter) return false;
    if (muniFilter && b.municipality !== muniFilter) return false;
    if (maxPrice && b.price > parseFloat(maxPrice)) return false;
    return true;
  });

  const qty = parseFloat(purchaseQty) || 0;
  const materialCost = inspectBatch ? qty * inspectBatch.price : 0;
  const handlingCharges = Math.round(materialCost * 0.03);
  const transportCharges = Math.round(qty * 2.5);
  const subtotal = materialCost + handlingCharges + transportCharges;
  const gst = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gst;

  const handleCloseInspect = () => {
    setInspectBatch(null);
    setPurchaseQty('');
  };

  const uniqueTypes = [...new Set(batches.map((b) => b.type))];
  const uniqueMunis = [...new Set(batches.map((b) => b.municipality))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-black text-slate-800">Plastic Marketplace</h2>
          </div>
          <p className="text-sm text-slate-500">
            Browse verified recycled plastic batches from municipal partners.
          </p>
        </div>
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search batches…"
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Filter className="h-3.5 w-3.5 text-amber-600" /> Filters:
        </div>
        <div className="relative">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="appearance-none rounded-lg bg-white border border-slate-200 pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm cursor-pointer">
            <option value="">All Types</option>
            {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={muniFilter} onChange={(e) => setMuniFilter(e.target.value)} className="appearance-none rounded-lg bg-white border border-slate-200 pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm cursor-pointer">
            <option value="">All Municipalities</option>
            {uniqueMunis.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max ₹/kg"
          className="w-24 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Batch</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Municipality</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Available (kg)</th>
                <th className="px-5 py-3.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Price / kg</th>
                <th className="px-5 py-3.5 text-right text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((batch) => (
                <tr key={batch.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-amber-800 text-xs">{batch.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200">
                      {batch.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-600">{batch.municipality}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-xs tabular-nums">{batch.available} kg</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-800 text-xs tabular-nums">₹{batch.price}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => { setInspectBatch(batch); setPurchaseQty(''); }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-bold px-3.5 py-2 text-[11px] shadow-sm shadow-amber-400/20 hover:from-amber-500 hover:to-yellow-500 hover:shadow-md hover:shadow-amber-400/30 transition-all active:scale-[0.97]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectBatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCloseInspect} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200/80 animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border-b border-amber-300/70 px-6 py-5 text-slate-900">
              <button onClick={handleCloseInspect} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200/70 hover:bg-amber-300 text-slate-800 transition-colors">
                <X className="h-4 w-4" />
              </button>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">Batch Inspection</p>
              <h3 className="text-lg font-black text-slate-900">Batch {inspectBatch.id}</h3>
              <p className="text-xs text-slate-700 mt-1">{inspectBatch.municipality}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Batch Info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Plastic Type</p>
                  <p className="text-sm font-black text-slate-800">{inspectBatch.type}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Quality</p>
                  <p className="text-sm font-black text-slate-800">{inspectBatch.quality}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Available</p>
                  <p className="text-sm font-black text-slate-800">{inspectBatch.available} kg</p>
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <Package className="inline h-3.5 w-3.5 mr-1 text-amber-600" />
                  Quantity to Purchase (kg)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={inspectBatch.available}
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  placeholder={`Min 1 kg — Max ${inspectBatch.available} kg`}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                />
                {qty > inspectBatch.available && (
                  <p className="text-xs text-red-500 mt-1 font-medium">Exceeds available quantity</p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Material Cost ({qty} kg × ₹{inspectBatch.price})</span>
                  <span className="font-bold text-slate-800 tabular-nums">₹{materialCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Handling Charges (3%)</span>
                  <span className="font-bold text-slate-800 tabular-nums">₹{handlingCharges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transport Charges</span>
                  <span className="font-bold text-slate-800 tabular-nums">₹{transportCharges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (18%)</span>
                  <span className="font-bold text-slate-800 tabular-nums">₹{gst.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-bold text-slate-700">Total Amount</span>
                  <span className="font-black text-amber-900 tabular-nums text-sm">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
              <button onClick={handleCloseInspect} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                disabled={qty <= 0 || qty > inspectBatch.available}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/25 hover:from-amber-500 hover:to-yellow-500 hover:shadow-xl hover:shadow-amber-400/30 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4" />
                Submit Purchase Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
