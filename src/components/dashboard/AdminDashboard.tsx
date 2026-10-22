import React from 'react';
import {
  Users, BedDouble, AlertTriangle, CreditCard, Send, Wrench,
  UserPlus, UserCheck, Bell, PlusCircle, ArrowUpRight, TrendingUp,
  Building, CheckCircle2, Clock
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { StatCard } from '../common/StatCard';
import { BarChart } from '../charts/BarChart';
import { DonutChart } from '../charts/DonutChart';
import { LineChart } from '../charts/LineChart';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AdminDashboardProps {
  onNavigate: (module: string) => void;
  onOpenAddStudent: () => void;
  onOpenAllocateModal: () => void;
  onOpenRecordPayment: () => void;
  onOpenAddNotice: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenAddStudent,
  onOpenAllocateModal,
  onOpenRecordPayment,
  onOpenAddNotice
}) => {
  const { stats, hostels, rooms, complaints, activityLogs, payments } = useHostel();

  // 1. Chart: Occupancy by Hostel
  const occupancyByHostel = hostels.map(h => {
    const hostelRooms = rooms.filter(r => r.hostelId === h.id);
    const occupied = hostelRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
    const total = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return {
      label: h.code,
      value: occupied,
      color: h.type === 'Girls' ? '#ec4899' : '#3b82f6'
    };
  });

  // 2. Chart: Complaints by Category
  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const complaintDonutData = [
    { label: 'Electrical', value: categoryCounts['Electrical'] || 4, color: '#f59e0b' },
    { label: 'Plumbing', value: categoryCounts['Plumbing'] || 3, color: '#06b6d4' },
    { label: 'Internet', value: categoryCounts['Internet'] || 3, color: '#3b82f6' },
    { label: 'Room/Asset', value: categoryCounts['Room'] || 2, color: '#8b5cf6' },
    { label: 'Cleaning', value: categoryCounts['Cleaning'] || 3, color: '#10b981' },
  ];

  // 3. Chart: Monthly Admissions Trend
  const admissionsTrend = [
    { label: 'May', value: 12 },
    { label: 'Jun', value: 45 },
    { label: 'Jul', value: 120 },
    { label: 'Aug', value: 85 },
    { label: 'Sep', value: 38 },
  ];

  // 4. Chart: Monthly Revenue
  const revenueTrend = [
    { label: 'May', value: 120000 },
    { label: 'Jun', value: 350000 },
    { label: 'Jul', value: 890000 },
    { label: 'Aug', value: 1240000 },
    { label: 'Sep', value: 750000 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-brand-200 border border-white/15 mb-2">
            Campus Executive Control Room
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central Hostel Operations Overview
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Real-time status across all 4 residential halls, beds, payments, and student life services.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onOpenAddStudent}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button
            onClick={onOpenAllocateModal}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center space-x-2"
          >
            <BedDouble className="w-4 h-4" />
            <span>Allocate Room</span>
          </button>
          <button
            onClick={onOpenRecordPayment}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Fee</span>
          </button>
        </div>
      </div>

      {/* Primary 8 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Residents"
          value={stats.totalStudents}
          subtitle="Enrolled scholars in hostel"
          icon={Users}
          colorScheme="blue"
          trend={{ value: '+12% this term', isPositive: true }}
          onClick={() => onNavigate('students')}
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          subtitle={`Across ${hostels.length} residential blocks`}
          icon={Building}
          colorScheme="slate"
          onClick={() => onNavigate('rooms')}
        />
        <StatCard
          title="Bed Occupancy"
          value={`${stats.occupiedBeds} / ${stats.occupiedBeds + stats.availableBeds}`}
          subtitle={`${stats.occupancyRate}% overall occupancy`}
          icon={BedDouble}
          colorScheme="emerald"
          trend={{ value: `${stats.availableBeds} beds vacant`, isPositive: true }}
          onClick={() => onNavigate('rooms')}
        />
        <StatCard
          title="Total Fee Collection"
          value={formatCurrency(stats.totalCollectedFees)}
          subtitle="Realized fee revenue"
          icon={CreditCard}
          colorScheme="purple"
          trend={{ value: '+8.4% YoY', isPositive: true }}
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(stats.pendingFees)}
          subtitle="Unpaid student dues"
          icon={CreditCard}
          colorScheme="amber"
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          title="Open Complaints"
          value={stats.pendingComplaints}
          subtitle="Needs staff attention"
          icon={AlertTriangle}
          colorScheme="rose"
          onClick={() => onNavigate('complaints')}
        />
        <StatCard
          title="Pending Leave Passes"
          value={stats.pendingLeaves}
          subtitle="Awaiting Warden sign-off"
          icon={Send}
          colorScheme="blue"
          onClick={() => onNavigate('leave')}
        />
        <StatCard
          title="Active Maintenance"
          value={stats.openMaintenance}
          subtitle="Technician job orders"
          icon={Wrench}
          colorScheme="amber"
          onClick={() => onNavigate('maintenance')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy by Hostel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Occupied Beds by Hostel Block
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live bed count per residential hall
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              Live Roster
            </span>
          </div>
          <BarChart data={occupancyByHostel} height={230} valueSuffix=" beds" />
        </div>

        {/* Complaints by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tickets by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Breakdown of active maintenance & student complaints
              </p>
            </div>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All &rarr;
            </button>
          </div>
          <DonutChart
            data={complaintDonutData}
            centerLabel="Tickets"
            centerValue={complaints.length}
            size={180}
          />
        </div>
      </div>

      {/* Row 2: Monthly Fee Collection Trend + Student Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Fee Realization (INR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Collections trajectory across the current semester
              </p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Fee Ledger &rarr;
            </button>
          </div>
          <LineChart
            data={revenueTrend}
            height={200}
            valuePrefix="₹"
            strokeColor="#10b981"
          />
        </div>

        {/* Admissions Intake Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                New Student Admissions Intake
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of registered hostel applications approved per month
              </p>
            </div>
            <button
              onClick={() => onNavigate('admissions')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Applications &rarr;
            </button>
          </div>
          <LineChart
            data={admissionsTrend}
            height={200}
            valueSuffix=" scholars"
            strokeColor="#2563eb"
          />
        </div>
      </div>

      {/* Recent Activity Timeline & Quick Action Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Campus Activity Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time operational events and administrative actions
              </p>
            </div>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              Connected
            </span>
          </div>

          <div className="space-y-3.5">
            {activityLogs.slice(0, 6).map((log, idx) => (
              <div
                key={log.id || idx}
                className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 transition-colors"
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-brand-600 shadow-sm flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {log.action}
                  </p>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                    <span>By {log.actor}</span>
                    <span>•</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Panel (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Admin Quick Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Common routine tasks at your fingertips
            </p>

            <div className="space-y-2.5">
              <button
                onClick={onOpenAddStudent}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-xs font-bold"
              >
                <div className="flex items-center space-x-2.5">
                  <UserPlus className="w-4 h-4 text-brand-600" />
                  <span>Enroll New Resident</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenAllocateModal}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-xs font-bold"
              >
                <div className="flex items-center space-x-2.5">
                  <BedDouble className="w-4 h-4 text-teal-600" />
                  <span>Smart Bed Allocation</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenRecordPayment}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-xs font-bold"
              >
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Receive Fee & Issue Receipt</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onOpenAddNotice}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-xs font-bold"
              >
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-purple-600" />
                  <span>Broadcast Notice</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/60 border border-slate-200/70 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-xs font-bold"
              >
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Generate Audit Reports</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              HostelHub Enterprise Core v2.4 • College Presentation Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
