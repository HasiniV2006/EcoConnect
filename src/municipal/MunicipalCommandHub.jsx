import React from 'react';
import {
  AlertTriangle,
  Users,
  Scale,
  Boxes,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';

const metrics = [
  {
    label: 'Open Complaints',
    value: '3',
    sub: 'Pending',
    icon: AlertTriangle,
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    ringColor: 'ring-red-200/60',
    shadowColor: 'shadow-red-500/15',
    trend: '+1 today',
  },
  {
    label: 'Assigned Teams',
    value: '4',
    sub: 'Active',
    icon: Users,
    color: 'from-blue-600 to-sky-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    ringColor: 'ring-blue-200/60',
    shadowColor: 'shadow-blue-500/15',
    trend: '2 dispatched',
  },
  {
    label: 'Verified Today',
    value: '142.5',
    sub: 'kg',
    icon: Scale,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    ringColor: 'ring-emerald-200/60',
    shadowColor: 'shadow-emerald-500/15',
    trend: '+18.2 kg',
  },
  {
    label: 'Total Plastic Stock',
    value: '1,840',
    sub: 'kg',
    icon: Boxes,
    color: 'from-blue-600 to-sky-700',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    ringColor: 'ring-blue-200/60',
    shadowColor: 'shadow-blue-500/15',
    trend: '4 types',
  },
];

export default function MunicipalCommandHub({ onNavigateTab }) {
  return (
    <div className="space-y-7 animate-fade-in">
      {/* ─── Banner Header ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-800/25">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-8 flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
          <Activity className="h-3.5 w-3.5 text-emerald-300" />
          <span className="text-[11px] font-semibold text-emerald-200">Live Operations</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-amber-300" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              Municipal Operations Dashboard
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Municipal Operations Dashboard
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Dispatch team assignments for civic issues, verify citizen plastic weights,
            and monitor real-time municipal plastic inventory.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigateTab('complaints')}
              className="group inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-all active:scale-[0.97]"
            >
              <AlertTriangle className="h-4 w-4" />
              Review Complaints
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onNavigateTab('collections')}
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.97]"
            >
              <Scale className="h-4 w-4" />
              Weigh Incoming Plastic
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Quick Metrics Grid (2x2) ─── */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
          Quick Metrics Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className={`card-hover group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm ${m.shadowColor} stagger-${idx + 1}`}
                style={{ animationFillMode: 'both' }}
              >
                {/* Subtle gradient accent */}
                <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${m.color} opacity-[0.06] rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`} />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      {m.label}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900 tabular-nums">
                        {m.value}
                      </span>
                      <span className={`text-sm font-bold ${m.textColor}`}>{m.sub}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <TrendingUp className={`h-3 w-3 ${m.textColor}`} />
                      <span className="text-[11px] font-medium text-slate-500">{m.trend}</span>
                    </div>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.bgLight} ring-1 ${m.ringColor}`}
                  >
                    <Icon className={`h-5 w-5 ${m.textColor}`} strokeWidth={2.2} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Recent Activity Feed ─── */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700">Recent Activity Log</h3>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2.5 py-0.5 ring-1 ring-blue-200/60">
            Last 24h
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            {
              time: '14:32',
              text: 'Electrical Squad B dispatched to Avenue 9 (Broken Streetlights)',
              type: 'dispatch',
            },
            {
              time: '13:15',
              text: 'Request #REQ-8902 verified — 3.2 kg — 80 PTS credited',
              type: 'verify',
            },
            {
              time: '11:48',
              text: 'New complaint #CIV-9012 received — Deep Pothole on Main Market Road',
              type: 'alert',
            },
            {
              time: '10:20',
              text: 'Request #REQ-8841 weighed — 5.2 kg Hard Plastics — awaiting verification',
              type: 'pending',
            },
            {
              time: '09:05',
              text: 'Roads & Asphalt Crew team deployed for Zone 4 road maintenance',
              type: 'dispatch',
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
              <span className="text-xs font-mono font-semibold text-slate-400 w-12 shrink-0">
                {item.time}
              </span>
              <div
                className={`h-2 w-2 rounded-full shrink-0 ${
                  item.type === 'dispatch'
                    ? 'bg-blue-500'
                    : item.type === 'verify'
                    ? 'bg-emerald-500'
                    : item.type === 'alert'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
