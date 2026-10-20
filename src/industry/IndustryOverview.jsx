import React from 'react';
import {
  Boxes,
  IndianRupee,
  Clock,
  Truck,
  TrendingUp,
  ArrowUpRight,
  Zap,
  Activity,
} from 'lucide-react';

const metrics = [
  {
    label: 'Procured',
    value: '4,280',
    sub: 'kg',
    icon: Boxes,
    color: 'from-amber-400 to-yellow-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-800',
    ringColor: 'ring-amber-200/80',
    shadowColor: 'shadow-amber-500/10',
    trend: '+320 kg this month',
  },
  {
    label: 'Expenditure',
    value: '₹2,14,500',
    sub: '',
    icon: IndianRupee,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    ringColor: 'ring-blue-200/60',
    shadowColor: 'shadow-blue-500/15',
    trend: '₹38,200 this month',
  },
  {
    label: 'Pending Requests',
    value: '2',
    sub: 'Active',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    ringColor: 'ring-amber-200/60',
    shadowColor: 'shadow-amber-500/15',
    trend: '1 under review',
  },
  {
    label: 'Active Orders',
    value: '3',
    sub: 'In Transit',
    icon: Truck,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    ringColor: 'ring-violet-200/60',
    shadowColor: 'shadow-violet-500/15',
    trend: '1 arriving today',
  },
];

export default function IndustryOverview() {
  return (
    <div className="space-y-7 animate-fade-in">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border border-amber-300/70 p-6 sm:p-8 text-slate-900 shadow-lg shadow-amber-400/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/30 rounded-full translate-y-1/2" />
        <div className="absolute top-4 right-8 flex items-center gap-2 bg-amber-200/70 border border-amber-300/80 rounded-full px-3 py-1">
          <Activity className="h-3.5 w-3.5 text-amber-800" />
          <span className="text-[11px] font-bold text-amber-900">Live Dashboard</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
              Industry Procurement Dashboard
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-slate-900">
            Green Polymer Industries
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed">
            Browse available recycled plastic batches, submit purchase requests,
            and track your orders from municipal facilities.
          </p>
        </div>
      </div>

      {/* 2×2 Metrics Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
          Quick Summary
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
                      {m.sub && (
                        <span className={`text-sm font-bold ${m.textColor}`}>{m.sub}</span>
                      )}
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

      {/* Recent Activity */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700">Recent Procurement Activity</h3>
          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 rounded-full px-2.5 py-0.5 ring-1 ring-amber-300/80">
            Last 7 days
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { time: '14:32', text: 'Purchase request #PR-1045 approved — 500 kg PET', type: 'approve' },
            { time: '11:15', text: 'Shipment #SHP-2089 dispatched from Municipal Depot Zone 4', type: 'dispatch' },
            { time: '09:48', text: 'New batch BT-4021 listed — 280 kg HDPE at ₹42/kg', type: 'new' },
            { time: 'Yesterday', text: 'Order #ORD-3012 delivered — 750 kg PP at factory gate', type: 'complete' },
            { time: '2 days ago', text: 'Purchase request #PR-1042 submitted — 400 kg LDPE', type: 'pending' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
              <span className="text-xs font-mono font-semibold text-slate-400 w-16 shrink-0">
                {item.time}
              </span>
              <div
                className={`h-2 w-2 rounded-full shrink-0 ${
                  item.type === 'approve'
                    ? 'bg-amber-500'
                    : item.type === 'dispatch'
                    ? 'bg-blue-500'
                    : item.type === 'new'
                    ? 'bg-violet-500'
                    : item.type === 'complete'
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
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
