import React, { useState, useRef, useEffect } from 'react';
import {
  Menu, Search, Bell, Sun, Moon, LogOut, Settings, CheckCheck,
  Building2, User as UserIcon, ShieldAlert, ChevronDown, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useHostel } from '../../context/HostelContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onNavigate: (module: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onNavigate
}) => {
  const { currentUser, currentRole, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationRead, clearNotifications } = useHostel();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'admin', label: 'Admin (Full Access)', desc: 'Dr. Rajesh Sharma', color: 'bg-rose-500' },
    { role: 'warden', label: 'Warden Portal', desc: 'Prof. Sunita Deshmukh', color: 'bg-blue-500' },
    { role: 'student', label: 'Student Portal', desc: 'Rahul Sharma (A-101)', color: 'bg-emerald-500' },
    { role: 'accountant', label: 'Accountant Portal', desc: 'Manoj Verma', color: 'bg-amber-500' },
    { role: 'staff', label: 'Maintenance Staff', desc: 'Ramesh Yadav', color: 'bg-purple-500' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left side: Hamburger & Search */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-3 w-44 sm:w-72 md:w-80 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs sm:text-sm group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
          <span className="truncate text-left flex-1">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: Role Switcher, Notifications, Dark Mode, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Demo Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors text-xs font-semibold"
            title="Switch User Role for Presentation"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="capitalize hidden md:inline">Role: {currentRole}</span>
            <span className="capitalize md:hidden">{currentRole}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-40">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Presentation Role Switch
              </div>
              {rolesList.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchDemoRole(r.role);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs ${
                    currentRole === r.role ? 'bg-brand-50/70 dark:bg-brand-950/50 font-bold text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2 h-2 rounded-full ${r.color}`} />
                    <div>
                      <p className="font-semibold capitalize">{r.role}</p>
                      <p className="text-[10px] text-slate-400">{r.desc}</p>
                    </div>
                  </div>
                  {currentRole === r.role && (
                    <span className="text-[10px] bg-brand-200/60 dark:bg-brand-900 px-1.5 py-0.5 rounded text-brand-800 dark:text-brand-200">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-40">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  Notifications ({unreadCount} new)
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center"
                  >
                    <CheckCheck className="w-3.5 h-3.5 mr-1" /> Clear all
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) onNavigate(n.link);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                        !n.read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h5 className={`text-xs font-semibold ${!n.read ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {n.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 rounded-full p-0.5 ring-2 ring-transparent hover:ring-brand-500 focus:outline-none transition-all"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-40">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || ''}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                  {currentUser?.role || 'Guest'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2.5 text-slate-400" />
                  Settings & Preferences
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
