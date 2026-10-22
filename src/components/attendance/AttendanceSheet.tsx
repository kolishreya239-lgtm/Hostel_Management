import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, Search, CheckCircle2, XCircle, Clock, Send,
  Download, Users, Save, Check
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus, Student } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';

export const AttendanceSheet: React.FC = () => {
  const { students, hostels, attendance, markAttendance } = useHostel();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-27');
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Daily attendance state mapping studentId -> status & remarks
  const [dailyStatus, setDailyStatus] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  useEffect(() => {
    // Load attendance for selectedDate if already recorded, or set default to Present
    const existing = attendance.filter(a => a.date === selectedDate);
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};

    students.forEach(s => {
      const rec = existing.find(e => e.studentId === s.studentId);
      if (rec) {
        map[s.studentId] = { status: rec.status, remarks: rec.remarks || '' };
      } else {
        map[s.studentId] = { status: 'Present', remarks: '' };
      }
    });

    setDailyStatus(map);
  }, [selectedDate, students, attendance]);

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.roomNo.toLowerCase().includes(q);
    const matchesHostel = !selectedHostelId || s.hostelId === selectedHostelId;
    return matchesSearch && matchesHostel;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setDailyStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setDailyStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated = { ...dailyStatus };
    filteredStudents.forEach(s => {
      updated[s.studentId] = { ...updated[s.studentId], status: 'Present' };
    });
    setDailyStatus(updated);
    showToast(`Marked ${filteredStudents.length} students as Present!`, 'info');
  };

  const handleSaveAttendance = () => {
    const records = Object.entries(dailyStatus).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      remarks: data.remarks
    }));

    markAttendance(records, currentUser?.name || 'Warden Office', selectedDate);
    showToast(`Daily attendance saved for ${selectedDate}!`, 'success');
  };

  const handleExport = () => {
    const exportData = filteredStudents.map(s => {
      const cur = dailyStatus[s.studentId] || { status: 'Present', remarks: '' };
      return {
        'Date': selectedDate,
        'Student ID': s.studentId,
        'Name': s.name,
        'Hostel': s.hostelName,
        'Room': s.roomNo,
        'Bed': s.bedNo,
        'Status': cur.status,
        'Remarks': cur.remarks
      };
    });
    exportToCSV(`HostelHub_Attendance_${selectedDate}`, exportData);
    showToast('Attendance roster exported to CSV!', 'info');
  };

  // Metrics for selected date & filtered list
  const totalRoster = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => dailyStatus[s.studentId]?.status === 'Present').length;
  const absentCount = filteredStudents.filter(s => dailyStatus[s.studentId]?.status === 'Absent').length;
  const lateCount = filteredStudents.filter(s => dailyStatus[s.studentId]?.status === 'Late').length;
  const leaveCount = filteredStudents.filter(s => dailyStatus[s.studentId]?.status === 'On Leave').length;
  const attendanceRate = totalRoster > 0 ? Math.round((presentCount / totalRoster) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Daily Hostel Roll-Call & Attendance Roster
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track night-curfew attendance, unannounced absences, late sign-ins, and verified out-passes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance Roster</span>
          </button>
        </div>
      </div>

      {/* Aggregate Rate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-slate-400 block font-medium">Total Scholars</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">{totalRoster}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
          <span className="block font-medium">Present Today</span>
          <span className="text-xl font-black mt-0.5 block">{presentCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800 text-rose-900 dark:text-rose-300">
          <span className="block font-medium">Absent</span>
          <span className="text-xl font-black mt-0.5 block">{absentCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 text-amber-900 dark:text-amber-300">
          <span className="block font-medium">Late Entry</span>
          <span className="text-xl font-black mt-0.5 block">{lateCount}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800 text-blue-900 dark:text-blue-300">
          <span className="block font-medium">Presence Rate</span>
          <span className="text-xl font-black mt-0.5 block">{attendanceRate}%</span>
        </div>
      </div>

      {/* Controls: Date Picker, Hostel, Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Filter by Hostel Block
            </label>
            <select
              value={selectedHostelId}
              onChange={e => setSelectedHostelId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Residential Halls</option>
              {hostels.map(h => (
                <option key={h.id} value={h.id}>{h.code} – {h.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Search Resident
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, room or ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Interactive Roll-Call Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Resident Student</th>
                <th className="py-3.5 px-3">Room / Bed</th>
                <th className="py-3.5 px-3">Hostel Block</th>
                <th className="py-3.5 px-3 text-center">Status Action</th>
                <th className="py-3.5 px-4">Warden Remarks / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(student => {
                const cur = dailyStatus[student.studentId] || { status: 'Present', remarks: '' };

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{student.studentId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-brand-600 dark:text-brand-400">
                        {student.roomNo || 'Unassigned'}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{student.bedNo}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {student.hostelName.split(' ')[0]}
                    </td>

                    {/* Interactive 4-State Button Group */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-x-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'Present')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            cur.status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'Absent')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            cur.status === 'Absent'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'Late')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            cur.status === 'Late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                          }`}
                        >
                          Late
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.studentId, 'On Leave')}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                            cur.status === 'On Leave'
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                          }`}
                        >
                          On Leave
                        </button>
                      </div>
                    </td>

                    {/* Remarks input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={cur.remarks}
                        onChange={e => handleRemarksChange(student.studentId, e.target.value)}
                        placeholder="Optional note (e.g. Lab work, Gate pass #89)..."
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
