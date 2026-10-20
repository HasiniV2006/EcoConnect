import React, { useState } from 'react';
import Header from './components/Header';
import TabsNavigation from './components/TabsNavigation';
import Dashboard from './components/Dashboard';
import PlasticPickup from './components/PlasticPickup';
import CreditsRewards from './components/CreditsRewards';
import ReportIssue from './components/ReportIssue';
import NewPickupModal from './components/NewPickupModal';
import ReportIssueModal from './components/ReportIssueModal';
import SettingsModal from './components/SettingsModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App({ onSwitchPortal }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletPoints, setWalletPoints] = useState(450);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Pickup Requests Data State
  const [requests, setRequests] = useState([
    {
      id: '#REQ-8892',
      date: 'Oct 19, 2026',
      slot: '09:00 AM',
      category: 'PET Bottles & HDPE',
      weight: '2.1 kg',
      verified: true,
      reward: '+52 PTS Added',
    },
    {
      id: '#REQ-8841',
      date: 'Oct 12, 2026',
      slot: '02:00 PM',
      category: 'Hard Plastics',
      weight: 'Pending',
      verified: false,
      reward: 'Pending Review',
    },
    {
      id: '#REQ-8790',
      date: 'Oct 05, 2026',
      slot: '10:00 AM',
      category: 'PET Bottles & HDPE',
      weight: '3.4 kg',
      verified: true,
      reward: '+85 PTS Added',
    },
    {
      id: '#REQ-8745',
      date: 'Sep 28, 2026',
      slot: '11:00 AM',
      category: 'LDPE Films & Wraps',
      weight: '1.8 kg',
      verified: true,
      reward: '+45 PTS Added',
    },
  ]);

  // Civic Issues Data State
  const [issues, setIssues] = useState([
    {
      id: '#CIV-9012',
      title: 'Deep Pothole on Main Market Road',
      category: 'Pothole / Road Damage',
      location: 'Sector 14, Near Metro Pillar #42',
      locationShort: 'Main Market Road',
      description: 'Hazardous deep hole causing vehicle damage and posing risk to two-wheelers. Multiple residents have reported near-accidents at this location during evening hours.',
      reportedTime: 'Reported: 2 days ago',
      status: 'IN PROGRESS',
      imageUrl: null,
      timelineSteps: [
        { label: 'Submitted', state: 'done' },
        { label: 'Assigned', state: 'done' },
        { label: 'In Progress', state: 'active' },
        { label: 'Resolved', state: 'pending' },
      ],
    },
  ]);

  // Handlers
  const handleAddPickup = (data) => {
    const newId = `#REQ-${Math.floor(8900 + Math.random() * 99)}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newReq = {
      id: newId,
      date: data?.date || today,
      slot: data?.slot || null,
      pickupDate: null,
      notes: data?.notes || '',
      photoUrl: data?.photoUrl || null,
      weight: 'Pending',
      verified: false,
      reward: 'Pending Review',
    };
    setRequests([newReq, ...requests]);
    showToast(`Pickup Request ${newId} scheduled for ${data?.date || today}!`);
  };

  const handleAddIssue = (data) => {
    const newId = `#CIV-${Math.floor(9020 + Math.random() * 80)}`;
    const newIssue = {
      id: newId,
      title: data.title,
      category: data.category,
      location: data.location,
      locationShort: data.location.split(',')[0],
      description: data.description,
      reportedTime: 'Reported: Just now',
      status: 'IN PROGRESS',
      imageUrl: data.imageUrl,
      timelineSteps: [
        { label: 'Submitted', state: 'done' },
        { label: 'Assigned', state: 'done' },
        { label: 'In Progress', state: 'active' },
        { label: 'Resolved', state: 'pending' },
      ],
    };
    setIssues([newIssue, ...issues]);
    showToast(`Civic issue ${newId} logged with Municipal Public Works!`);
  };

  const handleRedeem = (cost, title, code) => {
    setWalletPoints((prev) => Math.max(0, prev - cost));
    showToast(`Voucher redeemed for ${title}! Code: ${code}`);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            walletPoints={walletPoints}
            onNavigateTab={setActiveTab}
          />
        );
      case 'pickup':
        return (
          <PlasticPickup
            requests={requests}
            onOpenModal={() => setShowPickupModal(true)}
          />
        );
      case 'credits':
        return (
          <CreditsRewards
            walletPoints={walletPoints}
            onRedeem={handleRedeem}
          />
        );
      case 'report':
        return (
          <ReportIssue
            issues={issues}
            onOpenModal={() => setShowReportModal(true)}
          />
        );
      default:
        return <Dashboard walletPoints={walletPoints} onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50/40 via-teal-50/20 to-slate-50 text-slate-800">
      {/* ─── Left Sidebar Column (Citizen, Plastic, etc. tabs) ─── */}
      <TabsNavigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        walletPoints={walletPoints}
        onOpenSettings={() => setShowSettings(true)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onSwitchPortal={onSwitchPortal}
      />

      {/* ─── Main Content Container (Right Side) ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          walletPoints={walletPoints}
          onOpenSettings={() => setShowSettings(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Tab Content */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderActiveTab()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 EcoCivic Citizen Portal. Municipal Environmental & Sanitation Dept.</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Citizen Portal Live • Sector 14 Ward
            </span>
          </div>
        </footer>
      </div>

      {/* ─── Modals ─── */}
      <NewPickupModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        onSubmit={handleAddPickup}
      />

      <ReportIssueModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleAddIssue}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* ─── Toast Notification ─── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-md animate-slide-up rounded-2xl bg-slate-900 text-white p-4 shadow-2xl border border-slate-700/80 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium leading-snug">
            {toast.message}
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
