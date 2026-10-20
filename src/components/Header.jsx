import React from 'react';
import { Menu, Coins, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  dashboard: 'Citizen Dashboard',
  pickup: 'Plastic Pickup Request',
  credits: 'Credits & Rewards',
  report: 'Report Civic Issue',
};

export default function Header({
  activeTab,
  walletPoints,
  onOpenSettings,
  onOpenMobileMenu,
}) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Trigger & Active Tab Title */}
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
              {pageTitles[activeTab] || 'Citizen Portal'}
            </h1>
            <p className="hidden sm:block text-xs text-slate-400">
              Municipal Corporation • Ward {user?.ward || 'SEC-14'}
            </p>
          </div>
        </div>

        {/* Right Section: Wallet Badge, User, Settings, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Badge Pill */}
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-3.5 py-1.5 border border-emerald-200/80 shadow-sm transition-all hover:shadow-md">
            <Coins className="h-4 w-4 text-emerald-600" strokeWidth={2.2} />
            <span className="text-xs sm:text-sm font-bold text-emerald-800">
              Wallet: <span className="tabular-nums">{walletPoints} PTS</span>
            </span>
          </div>

          {/* User Name Pill */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-semibold">
              <UserIcon className="h-3.5 w-3.5 text-emerald-600" />
              <span>{user.name || 'Citizen'}</span>
            </div>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-800 transition-all active:scale-95 shadow-sm"
            aria-label="Settings"
            title="Settings"
          >
            <Settings
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
              strokeWidth={2}
            />
          </button>

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

