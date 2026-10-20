import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import MunicipalApp from './municipal/MunicipalApp.jsx';
import IndustryApp from './industry/IndustryApp.jsx';
import LoginPage from './components/LoginPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Layers, Building2, User, Factory, Loader2, LogOut, Recycle } from 'lucide-react';
import './index.css';

function MainApp() {
  const { user, portal, setPortal, loading, logout, quickRoleLogin } = useAuth();

  // Initial loading splash
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-pulse">
            <Recycle className="h-8 w-8 text-slate-950 font-bold" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">EcoConnect</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 justify-center">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              Connecting to MongoDB Atlas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, display the Login & Role Selection Page
  if (!user) {
    return <LoginPage />;
  }

  // Active portal determination (support both 'municipal' and 'municipality')
  const isMunicipal = portal === 'municipal' || portal === 'municipality' || user.role === 'municipality';
  const isIndustry = portal === 'industry' || user.role === 'industry';
  const isCitizen = !isMunicipal && !isIndustry;

  const handleRoleSwitch = async (targetRole) => {
    if (quickRoleLogin) {
      await quickRoleLogin(targetRole);
    } else {
      setPortal(targetRole);
    }
  };

  return (
    <div className="relative">
      {/* Background sync indicator */}
      {loading && (
        <div className="fixed top-3 right-3 z-[110] flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs text-white backdrop-blur shadow-lg border border-slate-700">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
          <span>Syncing with server...</span>
        </div>
      )}

      {/* Active Portal Render */}
      {isMunicipal && (
        <MunicipalApp
          onSwitchPortal={(target) => {
            if (typeof target === 'string') handleRoleSwitch(target);
            else handleRoleSwitch('industry');
          }}
        />
      )}

      {isCitizen && (
        <App
          onSwitchPortal={(target) => {
            if (typeof target === 'string') handleRoleSwitch(target);
            else handleRoleSwitch('municipality');
          }}
        />
      )}

      {isIndustry && (
        <IndustryApp
          onSwitchPortal={(target) => {
            if (typeof target === 'string') handleRoleSwitch(target);
            else handleRoleSwitch('municipality');
          }}
        />
      )}

      {/* Persistent Global Switcher & Session Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99] flex items-center gap-1.5 rounded-full bg-slate-900/95 backdrop-blur-md px-2 py-1.5 shadow-2xl border border-slate-700/80 text-white text-xs font-semibold max-w-[95vw] overflow-x-auto">
        <div className="flex items-center gap-1 px-2 py-1 text-slate-400 font-bold uppercase tracking-wider text-[10px] hidden md:flex shrink-0">
          <Layers className="h-3.5 w-3.5 text-emerald-400" />
          <span>Role:</span>
        </div>

        <button
          onClick={() => handleRoleSwitch('citizen')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold shrink-0 ${
            isCitizen
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/50'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Switch to Citizen Portal"
        >
          <User className="h-3.5 w-3.5" />
          Citizen
        </button>

        <button
          onClick={() => handleRoleSwitch('municipality')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold shrink-0 ${
            isMunicipal
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Switch to Municipality Hub"
        >
          <Building2 className="h-3.5 w-3.5" />
          Municipality
        </button>

        <button
          onClick={() => handleRoleSwitch('industry')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold shrink-0 ${
            isIndustry
              ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/30 ring-1 ring-amber-300/80'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Switch to Industry Portal"
        >
          <Factory className="h-3.5 w-3.5" />
          Industry
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1 shrink-0" />

        {/* User Session & Logout */}
        <div className="flex items-center gap-2 pl-1 pr-1 shrink-0">
          <span className="text-[11px] text-slate-300 hidden sm:inline max-w-[120px] truncate" title={user.email}>
            {user.name || user.email}
          </span>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all text-xs font-semibold"
            title="Log Out of Portal"
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  </React.StrictMode>
);
