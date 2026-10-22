import React, { useState } from 'react';
import {
  Settings, User, Building, Bell, Database, Shield,
  Sun, Moon, RefreshCw, Download, CheckCircle, Save, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useHostel } from '../../context/HostelContext';
import { useToast } from '../common/Toast';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetToDefaultData, students, rooms, hostels } = useHostel();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'hostel' | 'notifications' | 'system'>('profile');

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Dr. Alok Verma',
    email: currentUser?.email || 'admin@hostelhub.ac.in',
    phone: '+91 98765 43210',
    bio: 'Chief Hostel Warden & Administrative Officer'
  });

  // Hostel Config state
  const [hostelConfig, setHostelConfig] = useState({
    institutionName: 'Apex Institute of Technology & Engineering',
    campusHostelName: 'HostelHub Central Residences',
    curfewTime: '21:30',
    visitorHoursEnd: '19:00',
    academicYear: '2026-2027',
    contactSupport: 'support@hostelhub.ac.in'
  });

  // Notification Preferences
  const [notifs, setNotifs] = useState({
    feeReminders: true,
    curfewAlerts: true,
    complaintUpdates: true,
    visitorCheckIns: false,
    dailyReportEmail: true
  });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Admin profile preferences saved successfully!', 'success');
  };

  const handleSaveHostelConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Hostel operational parameters updated!', 'success');
  };

  const handleExportDatabase = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      system: 'HostelHub',
      studentsCount: students.length,
      roomsCount: rooms.length,
      hostelsCount: hostels.length,
      localStorageDump: { ...localStorage }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HostelHub_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Complete database JSON backup downloaded!', 'success');
  };

  const handleResetData = () => {
    resetToDefaultData();
    setIsResetConfirmOpen(false);
    showToast('Database reset to initial demo state with sample Indian data!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <span>System Settings & Configuration</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage administrator profile, residential campus policies, notifications, and data backups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => setActiveTab('hostel')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'hostel'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Campus & Policies</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'notifications'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'system'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data, Backup & Theme</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="lg:col-span-3">
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {profileData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{profileData.name}</h3>
                  <p className="text-xs text-slate-500">{currentUser?.email || profileData.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 uppercase tracking-wider">
                    Role: {currentRole}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Title
                    </label>
                    <input
                      type="text"
                      value={profileData.bio}
                      onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. Campus & Policies Tab */}
          {activeTab === 'hostel' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Campus Operational Policies</h3>
                <p className="text-xs text-slate-500">Configure default curfew timings, gate pass cutoffs, and campus branding</p>
              </div>

              <form onSubmit={handleSaveHostelConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    value={hostelConfig.institutionName}
                    onChange={e => setHostelConfig({ ...hostelConfig, institutionName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Campus Curfew Cutoff Time (24h)
                    </label>
                    <input
                      type="time"
                      value={hostelConfig.curfewTime}
                      onChange={e => setHostelConfig({ ...hostelConfig, curfewTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Visitor Visiting Hours Cutoff
                    </label>
                    <input
                      type="time"
                      value={hostelConfig.visitorHoursEnd}
                      onChange={e => setHostelConfig({ ...hostelConfig, visitorHoursEnd: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Active Academic Session
                    </label>
                    <input
                      type="text"
                      value={hostelConfig.academicYear}
                      onChange={e => setHostelConfig({ ...hostelConfig, academicYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Warden Helpdesk Helpline
                    </label>
                    <input
                      type="email"
                      value={hostelConfig.contactSupport}
                      onChange={e => setHostelConfig({ ...hostelConfig, contactSupport: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Policies</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Automated Notifications</h3>
                <p className="text-xs text-slate-500">Configure real-time alerts dispatched to residents and staff</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'feeReminders', title: 'Fee Invoicing & Overdue Reminders', desc: 'Send automated email/SMS warnings to students 3 days prior to due date' },
                  { key: 'curfewAlerts', title: 'Night Curfew & Roll-Call Alerts', desc: 'Trigger warden alert when a student is marked Absent during daily roll-call' },
                  { key: 'complaintUpdates', title: 'Maintenance Ticket Status Updates', desc: 'Notify student instantly whenever their complaint is assigned or resolved' },
                  { key: 'visitorCheckIns', title: 'Visitor Gate Pass SMS', desc: 'Send SMS notification to resident when an approved visitor checks in at security gate' },
                  { key: 'dailyReportEmail', title: 'Daily Night Audit Report', desc: 'Email daily occupancy and attendance executive summary to Chief Warden at 23:00' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="max-w-md">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(notifs as any)[item.key]}
                        onChange={e => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. System & Backup Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* Appearance / Theme */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Appearance & Interface Theme</h3>
                <p className="text-xs text-slate-500 mb-4">Choose between clean light mode or comfortable dark mode</p>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-2 transition-all hover:bg-slate-100"
                  >
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Currently: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Click to switch)</span>
                  </button>
                </div>
              </div>

              {/* Data Export */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Database Snapshot</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Download a complete JSON database dump of all {students.length} students, {rooms.length} rooms, fee records, and audit logs.
                    </p>
                  </div>
                  <button
                    onClick={handleExportDatabase}
                    className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-2 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Reset Data */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-base mb-1">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Reset to Clean Demo Defaults</span>
                    </div>
                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80 max-w-lg">
                      Reset all students, allocations, fee invoices, leaves and logs back to the original demo dataset with realistic Indian sample data. Useful for presenting fresh demos.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center space-x-2 whitespace-nowrap"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset All Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Entire Database?"
        message="This action will erase local mutations and restore all sample students, rooms, beds, fee ledger, and admissions to factory demo defaults. Are you sure?"
        confirmLabel="Yes, Reset Database"
        isDestructive={true}
        onConfirm={handleResetData}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
