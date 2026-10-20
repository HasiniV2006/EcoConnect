import React from 'react';
import { Menu, Bell, Radio, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MunicipalHeader({ activeTab, onOpenMobileMenu }) {
  const { user, logout } = useAuth();

  const pageTitles = {
    command: 'Municipal Command Hub',
    complaints: 'Citizen Complaints Flow',
    collections: 'Plastic Collections & Verification',
    inventory: 'Plastic Inventory Stock',
    orders: 'Industry Orders',
  };

  const getInitials = (name) => {
    if (!name) return 'MU';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
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
              EcoConnect Municipal Operations • {user?.ward || 'Central Command Hub'}
            </p>
          </div>
        </div>

        {/* Right: Status, Bell, Officer, Logout */}
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

          {/* Officer Avatar & Info */}
          <div className="hidden md:flex items-center gap-2.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white text-[10px] font-bold">
              {getInitials(user?.name)}
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-slate-700">{user?.name || 'Officer R. Vance'}</p>
              <p className="text-[10px] text-slate-400">{user?.ward || 'Ops Chief'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logout && logout()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all active:scale-95 shadow-sm"
            aria-label="Log out"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}

