import React from 'react';
import {
  BedDouble, CreditCard, CalendarCheck, AlertTriangle, Send,
  Utensils, Bell, UserCheck, ArrowRight, CheckCircle2, AlertCircle,
  FileText, Plus, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface StudentDashboardProps {
  onNavigate: (module: string) => void;
  onOpenComplaintModal: () => void;
  onOpenLeaveModal: () => void;
  onOpenVisitorModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onOpenComplaintModal,
  onOpenLeaveModal,
  onOpenVisitorModal
}) => {
  const { currentUser } = useAuth();
  const { students, rooms, invoices, attendance, complaints, leaves, notices, messMenu } = useHostel();

  // Find currently logged-in student or default to Rahul Sharma (STU2026001)
  const student = students.find(s => s.studentId === currentUser?.studentId || s.email === currentUser?.email) || students[0];

  // Room details
  const room = rooms.find(r => r.roomNumber === student?.roomNo);

  // Student specific invoices & dues
  const studentInvoices = invoices.filter(i => i.studentId === student?.studentId);
  const pendingFeeBalance = studentInvoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  // Attendance metrics
  const myAttendance = attendance.filter(a => a.studentId === student?.studentId);
  const totalDays = myAttendance.length || 24;
  const presentDays = myAttendance.filter(a => a.status === 'Present').length || 22;
  const attendancePct = Math.round((presentDays / totalDays) * 100);

  // Student Complaints & Leaves
  const myComplaints = complaints.filter(c => c.studentId === student?.studentId);
  const openComplaints = myComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

  const myLeaves = leaves.filter(l => l.studentId === student?.studentId);
  const activeLeave = myLeaves.find(l => l.status === 'Approved' || l.status === 'Pending');

  // Today's mess menu (e.g. Sunday or today's day)
  const daysOfWeek: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const currentDayName = daysOfWeek[new Date().getDay()];
  const todaysMenu = messMenu.find(m => m.day === currentDayName) || messMenu[0];

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-200 border border-white/15 mb-2">
            Scholar Resident Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {student?.name || 'Rahul Sharma'}!
          </h2>
          <p className="mt-1 text-sm text-emerald-100 max-w-xl">
            {student?.hostelName} • Room {student?.roomNo} ({student?.bedNo}) • {student?.course} ({student?.year})
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onOpenComplaintModal}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Submit Complaint</span>
          </button>
          <button
            onClick={onOpenLeaveModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs backdrop-blur-md border border-emerald-500/40 transition-all flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
          <button
            onClick={onOpenVisitorModal}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center space-x-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Request Visitor</span>
          </button>
        </div>
      </div>

      {/* 5 Student Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="My Room"
          value={student?.roomNo || 'A-101'}
          subtitle={student?.bedNo || 'Bed 1'}
          icon={BedDouble}
          colorScheme="blue"
          onClick={() => onNavigate('my-room')}
        />
        <StatCard
          title="Fee Balance"
          value={formatCurrency(pendingFeeBalance)}
          subtitle={pendingFeeBalance === 0 ? 'All cleared ✓' : 'Due payment'}
          icon={CreditCard}
          colorScheme={pendingFeeBalance === 0 ? 'emerald' : 'amber'}
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          title="Attendance"
          value={`${attendancePct}%`}
          subtitle="Monthly percentage"
          icon={CalendarCheck}
          colorScheme="emerald"
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          title="My Complaints"
          value={openComplaints.length}
          subtitle="Open maintenance"
          icon={AlertTriangle}
          colorScheme={openComplaints.length > 0 ? 'rose' : 'slate'}
          onClick={() => onNavigate('complaints')}
        />
        <StatCard
          title="Leave Status"
          value={activeLeave ? activeLeave.status : 'On Campus'}
          subtitle={activeLeave ? `${formatDate(activeLeave.fromDate)}` : 'No active pass'}
          icon={Send}
          colorScheme="purple"
          onClick={() => onNavigate('leave')}
        />
      </div>

      {/* Room Details & Today's Mess Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Details & Roommates (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Room Allocation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {room?.hostelName || 'Aryabhata Hall'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              {room?.type || 'Double Sharing'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400">Room Number</span>
              <p className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {student?.roomNo}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400">Your Bed</span>
              <p className="font-bold text-base text-brand-600 dark:text-brand-400 mt-0.5">
                {student?.bedNo}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Room Occupants / Roommates
            </h4>
            <div className="space-y-2">
              {room?.beds.map((b, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                    b.studentId === student?.studentId
                      ? 'bg-brand-50/70 border-brand-200 dark:bg-brand-950/40 dark:border-brand-800 font-semibold text-brand-900 dark:text-brand-200'
                      : 'bg-slate-50 border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{b.bedNumber}:</span>
                    <span>{b.studentName || (b.isOccupied ? 'Occupied' : 'Vacant Bed')}</span>
                  </div>
                  {b.studentId === student?.studentId && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500 text-white font-bold">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Mess Menu (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Today&rsquo;s Dining Schedule ({todaysMenu.day})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Four daily balanced meals served hot at Central Dining Hall
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('mess')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Weekly Menu &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  Breakfast (07:30 - 09:30 AM)
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {todaysMenu.breakfast}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                  Lunch (12:30 - 02:30 PM)
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {todaysMenu.lunch}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                  Evening Snacks (05:00 - 06:15 PM)
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {todaysMenu.snacks}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider">
                  Dinner (08:00 - 10:00 PM)
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {todaysMenu.dinner}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Recent Notices & Complaints Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notice Board Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Important Hostel Notices
            </h3>
            <button
              onClick={() => onNavigate('notices')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Notice Board &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map(n => (
              <div
                key={n.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    n.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}>
                    {n.category} • {n.priority}
                  </span>
                  <span className="text-[10px] text-slate-400">{formatDate(n.publishedDate)}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {n.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* My Ticket Status Tracker */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Support & Repair Requests
            </h3>
            <button
              onClick={onOpenComplaintModal}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              + Raise New Ticket
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              You have no active maintenance issues registered.
            </div>
          ) : (
            <div className="space-y-3">
              {myComplaints.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          #{c.complaintNo}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          {c.category}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {c.subject}
                      </p>
                      {c.assignedStaffName && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Assigned to: <span className="font-semibold text-brand-600">{c.assignedStaffName}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
