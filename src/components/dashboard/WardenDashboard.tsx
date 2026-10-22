import React from 'react';
import {
  Users, CalendarCheck, Send, AlertTriangle, UserCheck, Wrench,
  CheckCircle, XCircle, ArrowRight, Bell, Shield, MapPin, Clock
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { formatDate } from '../../utils/formatters';

interface WardenDashboardProps {
  onNavigate: (module: string) => void;
  onOpenNoticeModal: () => void;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({
  onNavigate,
  onOpenNoticeModal
}) => {
  const { currentUser } = useAuth();
  const { students, attendance, leaves, complaints, visitors, maintenance, approveLeave, rejectLeave } = useHostel();

  const todayStr = '2026-09-27';
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const openComplaints = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
  const visitorsToday = visitors.filter(v => v.visitDate === todayStr);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-blue-200 border border-white/15 mb-2">
            Warden Authority Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Prof. Sunita Deshmukh'}
          </h2>
          <p className="mt-1 text-sm text-blue-200">
            Assigned Block: Aryabhata Hall of Residence (Boys) • Shift: Full-day Active
          </p>
        </div>

        {/* Quick actions for Warden */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Attendance</span>
          </button>
          <button
            onClick={onOpenNoticeModal}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center space-x-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>Post Notice</span>
          </button>
        </div>
      </div>

      {/* 6 Warden Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Residents"
          value={students.length}
          subtitle="Assigned scholars"
          icon={Users}
          colorScheme="blue"
          onClick={() => onNavigate('students')}
        />
        <StatCard
          title="Attendance"
          value={`${presentCount}/${students.length}`}
          subtitle="Marked today"
          icon={CalendarCheck}
          colorScheme="emerald"
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.length}
          subtitle="Requires review"
          icon={Send}
          colorScheme="purple"
          onClick={() => onNavigate('leave')}
        />
        <StatCard
          title="Open Complaints"
          value={openComplaints.length}
          subtitle="Needs resolution"
          icon={AlertTriangle}
          colorScheme="rose"
          onClick={() => onNavigate('complaints')}
        />
        <StatCard
          title="Visitors Today"
          value={visitorsToday.length}
          subtitle="Gate registrations"
          icon={UserCheck}
          colorScheme="emerald"
          onClick={() => onNavigate('visitors')}
        />
        <StatCard
          title="Maintenance"
          value={maintenance.filter(m => m.status !== 'Completed').length}
          subtitle="Open work tickets"
          icon={Wrench}
          colorScheme="amber"
          onClick={() => onNavigate('maintenance')}
        />
      </div>

      {/* Actionable Review Queue: Pending Leaves & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leaves to Approve/Reject */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Leave Passes ({pendingLeaves.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Outstation travel requests requiring parental check
              </p>
            </div>
            <button
              onClick={() => onNavigate('leave')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              All Leaves &rarr;
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No leave requests awaiting approval. All clear!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.map(leave => (
                <div
                  key={leave.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {leave.studentName} (Room {leave.roomNo})
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Destination: {leave.destination} • Parent: {leave.parentContact}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                      Pending
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    &ldquo;{leave.reason}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {formatDate(leave.fromDate)} &rarr; {formatDate(leave.toDate)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => rejectLeave(leave.id, currentUser?.name || 'Warden', 'Rejected by Warden')}
                        className="px-3 py-1 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => approveLeave(leave.id, currentUser?.name || 'Warden', 'Parent contacted. Approved.')}
                        className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                      >
                        Approve Pass
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Student Complaints */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Open Hostel Complaints ({openComplaints.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tickets awaiting maintenance completion
              </p>
            </div>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Complaints Hub &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {openComplaints.slice(0, 4).map(comp => (
              <div
                key={comp.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      #{comp.complaintNo}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      {comp.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                      {comp.priority}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">
                    {comp.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {comp.location} • By {comp.studentName} • Status: <span className="font-semibold text-brand-600">{comp.status}</span>
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('complaints')}
                  className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
