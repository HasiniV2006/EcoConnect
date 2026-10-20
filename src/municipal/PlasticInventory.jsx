import React from 'react';
import {
  Boxes,
  Wine,
  Box,
  Layers,
  Container,
  TrendingUp,
  Clock,
  BadgeCheck,
  User,
  ArrowUpRight,
} from 'lucide-react';

const inventoryData = [
  {
    code: 'PET #1',
    name: 'Polyethylene Terephthalate',
    stock: 720.5,
    capacity: 1000,
    icon: Wine,
    color: 'from-blue-600 to-sky-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    barColor: 'bg-gradient-to-r from-blue-600 to-sky-500',
    ringColor: 'ring-blue-200/60',
  },
  {
    code: 'HDPE #2',
    name: 'High-Density Polyethylene',
    stock: 540,
    capacity: 1000,
    icon: Box,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    ringColor: 'ring-emerald-200/60',
  },
  {
    code: 'LDPE #4',
    name: 'Low-Density Polyethylene',
    stock: 330,
    capacity: 1000,
    icon: Layers,
    color: 'from-sky-500 to-blue-600',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    barColor: 'bg-gradient-to-r from-sky-500 to-blue-600',
    ringColor: 'ring-sky-200/60',
  },
  {
    code: 'PP #5',
    name: 'Polypropylene',
    stock: 249.5,
    capacity: 1000,
    icon: Container,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    barColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
    ringColor: 'ring-amber-200/60',
  },
];

const auditLog = [
  {
    time: '14:32',
    reqId: '#REQ-8902',
    citizen: 'Raj Patel',
    type: 'PET #1',
    weight: '3.2 kg',
    credits: 80,
    officer: 'R. Vance',
  },
  {
    time: '13:15',
    reqId: '#REQ-8915',
    citizen: 'Maria Santos',
    type: 'HDPE #2',
    weight: '2.6 kg',
    credits: 57,
    officer: 'R. Vance',
  },
  {
    time: '11:48',
    reqId: '#REQ-8790',
    citizen: 'Arjun Mehta',
    type: 'PET #1',
    weight: '3.4 kg',
    credits: 85,
    officer: 'S. Kumar',
  },
  {
    time: '10:20',
    reqId: '#REQ-8745',
    citizen: 'Linda Chen',
    type: 'LDPE #4',
    weight: '1.8 kg',
    credits: 45,
    officer: 'R. Vance',
  },
  {
    time: '09:05',
    reqId: '#REQ-8710',
    citizen: 'James Wilson',
    type: 'PP #5',
    weight: '4.1 kg',
    credits: 82,
    officer: 'S. Kumar',
  },
];

export default function PlasticInventory() {
  const totalStock = inventoryData.reduce((acc, item) => acc + item.stock, 0);

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Boxes className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-black text-slate-800">Plastic Inventory Stock</h2>
          </div>
          <p className="text-sm text-slate-500">
            Auto-updated stock levels categorized by polymer resin type.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200/80 px-4 py-2 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Total Stock
            </p>
            <p className="text-lg font-black text-blue-800 tabular-nums">
              {totalStock.toLocaleString()} <span className="text-xs font-bold">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* Polymer Inventory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inventoryData.map((item, idx) => {
          const Icon = item.icon;
          const percentage = Math.round((item.stock / item.capacity) * 100);

          return (
            <div
              key={item.code}
              className={`card-hover group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm stagger-${idx + 1}`}
              style={{ animationFillMode: 'both' }}
            >
              {/* Decorative gradient */}
              <div
                className={`absolute top-0 right-0 h-20 w-20 bg-gradient-to-br ${item.color} opacity-[0.06] rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500`}
              />

              <div className="relative">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center rounded-lg ${item.bgLight} px-2 py-0.5 text-xs font-black ${item.textColor} ring-1 ${item.ringColor}`}
                      >
                        {item.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{item.name}</p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bgLight} ring-1 ${item.ringColor}`}
                  >
                    <Icon className={`h-5 w-5 ${item.textColor}`} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Stock Value */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {item.stock.toLocaleString()}
                  </span>
                  <span className={`text-sm font-bold ${item.textColor}`}>kg</span>
                  <span className="text-xs text-slate-400 ml-auto">{percentage}% capacity</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.barColor} transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Micro Info */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{Math.round(item.stock * 0.05)} kg today
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Cap: {item.capacity} kg
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Inflow Verification Audit Log */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Stock Inflow Verification Audit Log</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verified plastic entries with credit allocations
            </p>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2.5 py-0.5 ring-1 ring-blue-200/60">
            Today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Time
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Request ID
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Citizen
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Weight
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Credits
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                  Officer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLog.map((entry, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {entry.time}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold text-blue-700 text-xs">
                      {entry.reqId}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold shrink-0">
                        {entry.citizen.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-xs font-medium text-slate-700">{entry.citizen}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold text-slate-800 tabular-nums">
                      {entry.weight}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <ArrowUpRight className="h-3 w-3" />
                      +{entry.credits} PTS
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.officer}
                    </span>
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
