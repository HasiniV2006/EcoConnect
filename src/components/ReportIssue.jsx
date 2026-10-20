import React, { useState } from 'react';
import { Plus, MapPin, Clock, CheckCircle2, Wrench, Flag, AlertTriangle, Filter, ChevronRight, Eye } from 'lucide-react';

export default function ReportIssue({ issues, onOpenModal }) {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredIssues = filterCategory === 'ALL'
    ? issues
    : issues.filter((i) => i.category === filterCategory);

  return (
    <div className="animate-fade-in space-y-6">
      {/* ─── Top Action Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">Civic Issue Tracker</h2>
          <p className="text-sm text-slate-500 mt-0.5">Report community hazards, monitor municipal work orders, and track live resolution timelines</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenModal}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all active:scale-[0.97]"
          >
            Report New Issue
          </button>
        </div>
      </div>

      {/* ─── Issue Cards List ─── */}
      <div className="space-y-6">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="card-hover overflow-hidden rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm backdrop-blur"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                    issue.status === 'IN PROGRESS'
                      ? 'bg-amber-100 text-amber-800 ring-amber-300/70'
                      : issue.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 ring-emerald-300/70'
                        : 'bg-blue-100 text-blue-800 ring-blue-300/70'
                  }`}
                >
                  <Wrench className="h-3 w-3" />
                  {issue.status}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-600">{issue.id}</span>
                <span className="hidden sm:inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {issue.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{issue.reportedTime}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Image Thumbnail */}
                <div className="shrink-0">
                  <div className="relative h-44 w-full lg:w-64 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden group">
                    {issue.imageUrl ? (
                      <img src={issue.imageUrl} alt={issue.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">Photo Evidence</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{issue.locationShort || issue.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 space-y-3.5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5">{issue.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{issue.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Ward ID: <span className="font-mono text-emerald-700">WARD-SEC14</span></span>
                    <span>•</span>
                    <span>Department: <span className="font-medium text-slate-700">Public Works & Roads</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Resolution Timeline Tracker ─── */}
            <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolution Timeline Tracker</p>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 rounded-md px-2 py-0.5">
                  Est. Completion: 24-48 Hours
                </span>
              </div>

              <div className="flex items-center justify-between relative">
                {issue.timelineSteps.map((step, idx) => {
                  const isDone = step.state === 'done';
                  const isActive = step.state === 'active';
                  const isPending = step.state === 'pending';

                  return (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center gap-2 z-10">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ring-4 ring-white ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                              : isActive
                                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-amber-100'
                                : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                          ) : isActive ? (
                            <Wrench className="h-4 w-4 animate-bounce" strokeWidth={2.5} />
                          ) : (
                            <Flag className="h-4 w-4" strokeWidth={2} />
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold text-center whitespace-nowrap ${
                            isDone ? 'text-emerald-700' : isActive ? 'text-amber-700' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {idx < issue.timelineSteps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                            isDone && issue.timelineSteps[idx + 1]?.state !== 'pending'
                              ? 'bg-emerald-400'
                              : isDone && issue.timelineSteps[idx + 1]?.state === 'pending'
                                ? 'bg-gradient-to-r from-emerald-400 to-amber-400'
                                : isActive
                                  ? 'bg-gradient-to-r from-amber-400 to-slate-200'
                                  : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
