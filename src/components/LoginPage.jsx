import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Factory, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  Key, 
  UserPlus, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Recycle,
  Layers,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, quickRoleLogin } = useAuth();
  const [mode, setMode] = useState('roles'); // 'roles' | 'signin' | 'register'
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Sector 14');
  const [companyName, setCompanyName] = useState('');

  const demoRoles = [
    {
      id: 'citizen',
      name: 'Arjun Mehta',
      email: 'citizen@ecoconnect.local',
      role: 'citizen',
      title: 'Citizen Portal',
      badge: 'Resident Account',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description: 'Report civic waste dumping, schedule doorstep plastic pickups, and earn green wallet credits.',
      icon: User,
      accent: 'emerald',
      gradient: 'from-emerald-600/30 to-teal-700/20',
      borderHover: 'hover:border-emerald-500/80',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40',
    },
    {
      id: 'municipality',
      name: 'Officer R. Vance',
      email: 'admin@ecoconnect.local',
      role: 'municipality',
      title: 'Municipality Command Hub',
      badge: 'Civic Authority',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      description: 'Dispatch sanitation squads, verify pickup collection weights, and manage plastic inventory batches.',
      icon: Building2,
      accent: 'blue',
      gradient: 'from-blue-600/30 to-indigo-700/20',
      borderHover: 'hover:border-blue-500/80',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40',
    },
    {
      id: 'industry',
      name: 'Green Polymer Ind.',
      email: 'industry@ecoconnect.local',
      role: 'industry',
      title: 'Industry Buyer Portal',
      badge: 'Procurement Partner',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Procure bulk sorted plastic batches, submit purchase requests, and monitor delivery logistics.',
      icon: Factory,
      accent: 'amber',
      gradient: 'from-amber-600/30 to-yellow-700/20',
      borderHover: 'hover:border-amber-400/80',
      buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-900/40',
    },
  ];

  const handleRoleSelectLogin = async (roleObj) => {
    setError('');
    setLoading(true);
    try {
      if (quickRoleLogin) {
        await quickRoleLogin(roleObj.id);
      } else {
        await login({ email: roleObj.email, password: 'password123' });
      }
    } catch (err) {
      console.error('Role login failed:', err);
      setError(err.message || 'Login failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in Name, Email, and Password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role: selectedRole,
        ward: selectedRole === 'industry' ? undefined : ward,
        companyName: selectedRole === 'industry' ? companyName || name : undefined,
      };

      await register(payload);
      setSuccessMsg('Account created successfully! Entering dashboard...');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Decorative Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Navigation / Brand */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <Recycle className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">EcoConnect</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-400">Civic Circularity & Waste Governance Platform</p>
          </div>
        </div>

        {/* Database Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
          <Database className="h-3.5 w-3.5 text-emerald-400" />
          <span>MongoDB Atlas:</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-10 flex-1 flex flex-col justify-center">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Select Your Role to Access Portal
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Choose one of the 3 synchronized demo roles or sign in with your account to access real-time workflows.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <button
              onClick={() => { setMode('roles'); setError(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'roles'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              1-Click Role Login
            </button>
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Email & Password
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Create Account
            </button>
          </div>
        </div>

        {/* Global Alert / Error banner */}
        {error && (
          <div className="mb-6 max-w-md mx-auto w-full flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs shadow-lg animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 max-w-md mx-auto w-full flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs shadow-lg animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <p className="flex-1">{successMsg}</p>
          </div>
        )}

        {/* TAB 1: 3 ROLE CARDS (ONE-CLICK LOGIN) */}
        {mode === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoRoles.map((roleObj) => {
              const Icon = roleObj.icon;
              return (
                <div
                  key={roleObj.id}
                  className={`group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${roleObj.borderHover} backdrop-blur-sm`}
                >
                  <div>
                    {/* Top pill & icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${roleObj.gradient} flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${roleObj.badgeColor}`}>
                        {roleObj.badge}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {roleObj.title}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{roleObj.name}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400">{roleObj.email}</span>
                    </div>

                    <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                      {roleObj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <button
                      onClick={() => handleRoleSelectLogin(roleObj)}
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${roleObj.buttonBg} disabled:opacity-50 disabled:pointer-events-none`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Enter as {roleObj.id.charAt(0).toUpperCase() + roleObj.id.slice(1)}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MANUAL SIGN IN */}
        {mode === 'signin' && (
          <div className="max-w-md mx-auto w-full bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-1">Sign In to EcoConnect</h2>
            <p className="text-xs text-slate-400 mb-6">Enter your registered credentials below.</p>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@ecoconnect.local"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Quick Fill Hints */}
              <div className="pt-1">
                <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick prefill demo accounts:</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setEmail('citizen@ecoconnect.local'); setPassword('password123'); }}
                    className="text-[10px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30"
                  >
                    Citizen Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('admin@ecoconnect.local'); setPassword('password123'); }}
                    className="text-[10px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30"
                  >
                    Municipality Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('industry@ecoconnect.local'); setPassword('password123'); }}
                    className="text-[10px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30"
                  >
                    Industry Demo
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-900/40 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                <span>Sign In</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CREATE ACCOUNT / REGISTER */}
        {mode === 'register' && (
          <div className="max-w-md mx-auto w-full bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-1">Create an Account</h2>
            <p className="text-xs text-slate-400 mb-5">Select a role and register in MongoDB Atlas.</p>

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Role Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('citizen')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedRole === 'citizen'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('municipality')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedRole === 'municipality'
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Municipality
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('industry')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedRole === 'industry'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Industry
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {selectedRole === 'industry' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Enterprise Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. EcoPlast Solutions Ltd."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Ward / Zone</label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="Sector 14"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-900/40 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                <span>Register & Enter Portal</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>EcoConnect • Unified Civic Circular Economy System • Synchronized across MongoDB Atlas</p>
      </footer>
    </div>
  );
}
