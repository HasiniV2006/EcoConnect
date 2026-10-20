import React from 'react';
import { Menu, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function IndustryHeader({ activeTab, onOpenMobileMenu }) {
  const { user, logout } = useAuth();

  const pageTitles = {
    overview: 'Industry Overview',
    marketplace: 'Plastic Marketplace',
    requests: 'Purchase Requests',
    deliveries: 'Orders & Deliveries',
    profile: 'Company Profile',
  };

  const getInitials = (name) => {
    if (!name) return 'IP';
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
              {pageTitles[activeTab] || 'Industry Dashboard'}
            </h1>
            <p className="hidden sm:block text-xs text-slate-400">
              EcoConnect Industry Operations • {user?.companyName || user?.name || 'Green Polymer Industries'}
            </p>
          </div>
        </div>

        {/* Right: Search, Company, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search batches, orders…"
              className="w-56 rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
            />
          </div>

          {/* Company Avatar & Info */}
          <div className="hidden md:flex items-center gap-2.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 text-[10px] font-extrabold shadow-sm">
              {getInitials(user?.companyName || user?.name)}
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold text-slate-700">{user?.companyName || user?.name || 'Green Polymer Ind.'}</p>
              <p className="text-[10px] text-slate-400">{user?.industryType || 'Procurement Partner'}</p>
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

