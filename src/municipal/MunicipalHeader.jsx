import React from 'react';
import { Menu, Bell, Radio, User } from 'lucide-react';

export default function MunicipalHeader({ activeTab, onOpenMobileMenu }) {
  const pageTitles = {
    command: 'Municipal Command Hub',
    complaints: 'Citizen Complaints Flow',
    collections: 'Plastic Collections & Verification',
    inventory: 'Plastic Inventory Stock',
    orders: 'Industry Orders',
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              {pageTitles[activeTab] || 'Municipal Admin'}
            </h1>
            <p className="hidden sm:block text-xs text-slate-400">
              EcoConnect Municipal Operations • Zone 4
            </p>
          </div>
        </div>

        {/* Right: Status, Bell, Officer */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* System Status Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 border border-emerald-200/80 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              Dispatch System Active
            </span>
          </div>

          {/* Notification Bell */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-800 transition-all shadow-sm">
            <Bell className="h-4 w-4" strokeWidth={2} />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
              5
            </span>
          </button>

          {/* Officer Avatar & Info */}
          <div className="hidden md:flex items-center gap-2.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white text-[10px] font-bold">
              RV
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-slate-700">Officer R. Vance</p>
              <p className="text-[10px] text-slate-400">Zone 4 Ops Chief</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
