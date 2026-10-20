import React, { useState } from 'react';
import { X, User, Phone, MapPin, Home, Bell, BellOff, Moon, Sun, Globe, Shield, Sparkles } from 'lucide-react';

function Toggle({ enabled, onToggle, label, description, icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${enabled ? 'bg-eco-100 text-eco-600' : 'bg-surface-100 text-surface-400'} transition-colors`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-surface-700">{label}</p>
          {description && <p className="text-xs text-surface-400">{description}</p>}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${enabled ? 'bg-eco-500' : 'bg-surface-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState({
    sms: true,
    pickup: true,
    rewards: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[85vh] animate-slide-up overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-surface-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-100 bg-white/95 backdrop-blur px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-eco-500" />
            <h3 className="text-lg font-bold text-surface-800">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-all"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="divide-y divide-surface-100">
          {/* ─── Profile Info ─── */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-eco-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-surface-500">Profile Information</h4>
            </div>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Name', value: 'Arjun Mehta' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Citizen Ward ID', value: 'WARD-SEC14-0892' },
                { icon: Home, label: 'Home Address', value: '42-B, Green Park Colony, Sector 14' },
              ].map((field) => (
                <div key={field.label} className="flex items-start gap-3 rounded-xl bg-surface-50 px-4 py-3 ring-1 ring-surface-100">
                  <field.icon className="h-4 w-4 text-surface-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">{field.label}</p>
                    <p className="text-sm font-medium text-surface-700">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Notifications ─── */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-eco-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-surface-500">Notifications</h4>
            </div>
            <div className="divide-y divide-surface-50">
              <Toggle
                enabled={notifications.sms}
                onToggle={() => setNotifications(p => ({ ...p, sms: !p.sms }))}
                label="SMS Alerts"
                description="Receive text messages for updates"
                icon={notifications.sms ? Bell : BellOff}
              />
              <Toggle
                enabled={notifications.pickup}
                onToggle={() => setNotifications(p => ({ ...p, pickup: !p.pickup }))}
                label="Pickup Status"
                description="Get notified on pickup progress"
                icon={notifications.pickup ? Bell : BellOff}
              />
              <Toggle
                enabled={notifications.rewards}
                onToggle={() => setNotifications(p => ({ ...p, rewards: !p.rewards }))}
                label="Reward Notifications"
                description="Alerts when you earn credits"
                icon={notifications.rewards ? Bell : BellOff}
              />
            </div>
          </div>

          {/* ─── Preferences ─── */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-eco-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-surface-500">Preferences</h4>
            </div>
            <div className="space-y-4">
              <Toggle
                enabled={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
                label="Dark Mode"
                description="Switch to dark theme"
                icon={darkMode ? Moon : Sun}
              />
              <div>
                <label className="text-sm font-medium text-surface-700 mb-2 block">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-700 focus:border-eco-400 focus:ring-2 focus:ring-eco-400/20 focus:outline-none transition-all appearance-none"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
