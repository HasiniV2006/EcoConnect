import React from 'react';
import { X, Scale, Sparkles, BadgeCheck } from 'lucide-react';

export default function VerifyWeightModal({ isOpen, onClose, request, onVerify }) {
  const [measuredWeight, setMeasuredWeight] = React.useState('');

  if (!isOpen || !request) return null;

  const getRate = () => {
    if (!request?.category) return 25;
    const cat = request.category.toLowerCase();
    if (cat.includes('pet')) return 26;
    if (cat.includes('hdpe')) return 22;
    if (cat.includes('ldpe')) return 18;
    if (cat.includes('pp')) return 20;
    return 25;
  };

  const rate = getRate();
  const weight = parseFloat(measuredWeight) || 0;
  const credits = Math.round(weight * rate);

  const handleSubmit = () => {
    if (weight > 0) {
      onVerify(request.id, { measuredWeight: weight, credits });
      setMeasuredWeight('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200/80 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-1">
            Verify Plastic Type & Weight
          </p>
          <h3 className="text-lg font-black">
            Request ID: {request.id}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Citizen: {request.citizenName}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Citizen Estimate Reference */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Citizen Estimated Weight
            </p>
            <p className="text-lg font-black text-slate-800">{request.estWeight}</p>
          </div>

          {/* Measured Weight Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              <Scale className="inline h-3.5 w-3.5 mr-1 text-blue-600" />
              Measured Scale Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={measuredWeight}
              onChange={(e) => setMeasuredWeight(e.target.value)}
              placeholder="Enter weighed amount…"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Credits Banner */}
          <div
            className={`rounded-xl p-4 text-center transition-all duration-300 ${
              credits > 0
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm'
                : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles
                className={`h-4 w-4 ${credits > 0 ? 'text-amber-500' : 'text-slate-400'}`}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Credits to Award Citizen
              </span>
            </div>
            <div
              className={`text-3xl font-black tabular-nums ${
                credits > 0 ? 'text-amber-600' : 'text-slate-300'
              }`}
            >
              {credits} <span className="text-base font-bold">PTS</span>
            </div>
            {weight > 0 && (
              <p className="text-[10px] text-amber-600/70 mt-1 font-medium">
                {weight} kg × {rate} pts/kg = {credits} PTS
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={weight <= 0}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <BadgeCheck className="h-4 w-4" />
            Verify & Update Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
