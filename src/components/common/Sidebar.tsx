import React from 'react';
import {
  LayoutDashboard, Users, UserPlus, Building, BedDouble,
  CreditCard, CalendarCheck, AlertTriangle, Wrench, Send,
  UserCheck, Bell, Utensils, Boxes, Contact, FileBarChart2,
  Settings, LogOut, ChevronLeft, ChevronRight, X, Sparkles,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';

interface SidebarProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onNavigate,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const { currentRole, logout, canAccess } = useAuth();
  const { stats, admissions, complaints, leaves } = useHostel();

  const allNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: stats.totalStudents, badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'my-room', label: 'My Room & Bed', icon: BedDouble },
    { id: 'admissions', label: 'Admissions', icon: UserPlus, badge: admissions.filter(a => a.status === 'Pending').length, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
    { id: 'hostels', label: 'Hostel Blocks', icon: Building },
    { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble },
    { id: 'allocation', label: 'Room Allocation', icon: BedDouble },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle, badge: stats.pendingComplaints, badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: stats.openMaintenance, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
    { id: 'leave', label: 'Leave Requests', icon: Send, badge: leaves.filter(l => l.status === 'Pending').length, badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
    { id: 'visitors', label: 'Visitors Log', icon: UserCheck },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'mess', label: 'Mess & Dining', icon: Utensils },
    { id: 'inventory', label: 'Inventory Assets', icon: Boxes },
    { id: 'staff', label: 'Staff Directory', icon: Contact },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Filter items based on current role permissions
  const visibleNavItems = allNavItems.filter(item => {
    // If student, customize modules
    if (currentRole === 'student') {
      if (item.id === 'students' || item.id === 'admissions' || item.id === 'allocation' || item.id === 'inventory' || item.id === 'staff' || item.id === 'reports' || item.id === 'maintenance') {
        return false;
      }
      return true;
    }
    // If not student, hide my-room and personal profile
    if (item.id === 'my-room' || item.id === 'profile') return false;

    return canAccess(item.id);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'w-64'}`}
      >
        {/* Brand / Logo Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div
            className="flex items-center space-x-3 cursor-pointer overflow-hidden"
            onClick={() => onNavigate('dashboard')}
          >
            {/* Logo Icon: Building + Home badge */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
              <Building className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight transition-opacity duration-200 truncate">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                  Hostel<span className="text-brand-600">Hub</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold rounded">PRO</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium tracking-normal truncate">
                  Smart Management. Better Living.
                </p>
              </div>
            )}
          </div>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer: Collapse button & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-1">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center rounded-xl py-2 text-xs font-medium text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center space-x-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>

          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
