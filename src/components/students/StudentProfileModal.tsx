import React, { useState } from 'react';
import {
  Student, FeeInvoice, AttendanceRecord, Complaint, LeaveRequest, Visitor
} from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import {
  User, BookOpen, Building, CreditCard, CalendarCheck, AlertTriangle,
  Send, UserCheck, Phone, Mail, MapPin, HeartPulse, Shield, Printer
} from 'lucide-react';
import { printLeavePass } from '../../utils/leavePassGenerator';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAllocateRoom?: (student: Student) => void;
  onEdit?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenAllocateRoom
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'fees' | 'attendance' | 'complaints' | 'leaves' | 'visitors'>('profile');
  const { invoices, payments, attendance, complaints, leaves, visitors } = useHostel();

  if (!student) return null;

  // Linked records
  const studentInvoices = invoices.filter(i => i.studentId === student.studentId);
  const totalFees = studentInvoices.reduce((sum, i) => sum + i.amount, 0);
  const paidFees = studentInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const pendingFees = Math.max(0, totalFees - paidFees);

  const studentAttendance = attendance.filter(a => a.studentId === student.studentId);
  const totalDays = studentAttendance.length || 24;
  const presentDays = studentAttendance.filter(a => a.status === 'Present').length || 22;
  const absentDays = totalDays - presentDays;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  const studentComplaints = complaints.filter(c => c.studentId === student.studentId);
  const studentLeaves = leaves.filter(l => l.studentId === student.studentId);
  const studentVisitors = visitors.filter(v => v.studentId === student.studentId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${student.name} – Comprehensive Resident Dossier`}
      subtitle={`Student ID: ${student.studentId} • Roll: ${student.rollNo}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Profile Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-lg">
          <img
            src={student.photo}
            alt={student.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-md flex-shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-extrabold">{student.name}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(student.status)}`}>
                {student.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200">
                {student.gender}
              </span>
            </div>

            <p className="text-sm text-blue-200 mt-1">
              {student.course} ({student.year}) • Dept of {student.department}
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              {student.college}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center">
                <Building className="w-3.5 h-3.5 mr-1 text-brand-400" />
                {student.hostelName} | Room {student.roomNo || 'Unassigned'} ({student.bedNo || 'No Bed'})
              </span>
              <span className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-brand-400" />
                {student.phone}
              </span>
              <span className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-brand-400" />
                {student.email}
              </span>
            </div>
          </div>

          {onOpenAllocateRoom && (
            <button
              onClick={() => {
                onClose();
                onOpenAllocateRoom(student);
              }}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-colors flex-shrink-0"
            >
              Reallocate Bed
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'fees'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Fees & Invoices ({studentInvoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Attendance ({attendanceRate}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'complaints'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Complaints ({studentComplaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'leaves'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Out-Passes ({studentLeaves.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'visitors'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Visitors ({studentVisitors.length})</span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Personal Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center text-brand-600">
                <User className="w-4 h-4 mr-2" /> Personal & Medical Records
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Date of Birth:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(student.dob)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Blood Group:</span>
                  <p className="font-semibold text-rose-600">{student.bloodGroup}</p>
                </div>
                <div>
                  <span className="text-slate-400">Mobile Phone:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Emergency Phone:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.emergencyContact}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Permanent Address:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.address}</p>
                </div>
                {student.medicalNotes && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Medical Notes:</span>
                    <p className="font-semibold text-amber-700 dark:text-amber-400">{student.medicalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center text-indigo-600">
                <BookOpen className="w-4 h-4 mr-2" /> Academic Enrollment
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">College / Institute:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.college}</p>
                </div>
                <div>
                  <span className="text-slate-400">Roll Number:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.rollNo}</p>
                </div>
                <div>
                  <span className="text-slate-400">Department:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.department}</p>
                </div>
                <div>
                  <span className="text-slate-400">Course & Year:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.course} ({student.year})</p>
                </div>
                <div>
                  <span className="text-slate-400">Admission Date:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(student.admissionDate)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <p className="font-semibold text-emerald-600">{student.status}</p>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center text-emerald-600">
                <Shield className="w-4 h-4 mr-2" /> Guardian / Parent Profile
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Guardian Name:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.guardianName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Relationship:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.guardianRelation}</p>
                </div>
                <div>
                  <span className="text-slate-400">Guardian Mobile:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.guardianPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Guardian Email:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.guardianEmail}</p>
                </div>
              </div>
            </div>

            {/* Hostel Residency */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center text-teal-600">
                <Building className="w-4 h-4 mr-2" /> Current Hostel Allocation
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Hostel Name:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{student.hostelName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Floor Level:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Floor {student.floorNo}</p>
                </div>
                <div>
                  <span className="text-slate-400">Room Number:</span>
                  <p className="font-bold text-brand-600 text-sm">{student.roomNo || 'Unallocated'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Bed:</span>
                  <p className="font-bold text-brand-600 text-sm">{student.bedNo || 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fees & Invoices */}
        {activeTab === 'fees' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <span className="text-xs text-slate-400">Total Billed</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(totalFees)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                <span className="text-xs">Amount Paid</span>
                <p className="text-lg font-bold mt-0.5">{formatCurrency(paidFees)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                <span className="text-xs">Outstanding Balance</span>
                <p className="text-lg font-bold mt-0.5">{formatCurrency(pendingFees)}</p>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Term</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5 text-right">Amount</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="p-2.5 font-mono font-bold text-brand-600">{inv.invoiceNo}</td>
                    <td className="p-2.5">{inv.category}</td>
                    <td className="p-2.5">{inv.academicTerm}</td>
                    <td className="p-2.5">{formatDate(inv.dueDate)}</td>
                    <td className="p-2.5 text-right font-bold">{formatCurrency(inv.amount)}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Total Working Days</span>
                <p className="text-base font-bold text-slate-900 dark:text-white">{totalDays} Days</p>
              </div>
              <div>
                <span className="text-slate-400">Days Present</span>
                <p className="text-base font-bold text-emerald-600">{presentDays} Days</p>
              </div>
              <div>
                <span className="text-slate-400">Days Absent</span>
                <p className="text-base font-bold text-rose-600">{absentDays} Days</p>
              </div>
              <div>
                <span className="text-slate-400">Overall Ratio</span>
                <p className="text-base font-extrabold text-brand-600">{attendanceRate}%</p>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Marked By</th>
                    <th className="p-2.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studentAttendance.map(att => (
                    <tr key={att.id}>
                      <td className="p-2.5 font-medium">{formatDate(att.date)}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(att.status)}`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500">{att.markedBy}</td>
                      <td className="p-2.5 text-slate-500">{att.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Complaints */}
        {activeTab === 'complaints' && (
          <div className="space-y-3">
            {studentComplaints.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No complaints submitted.</div>
            ) : (
              studentComplaints.map(comp => (
                <div key={comp.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-brand-600">#{comp.complaintNo}</span> • <span className="font-semibold">{comp.category}</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{comp.subject}</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">{comp.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(comp.status)}`}>
                      {comp.status}
                    </span>
                  </div>
                  {comp.resolutionNotes && (
                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-300">
                      <strong>Resolution:</strong> {comp.resolutionNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Leaves */}
        {activeTab === 'leaves' && (
          <div className="space-y-3">
            {studentLeaves.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No leave requests recorded.</div>
            ) : (
              studentLeaves.map(lv => (
                <div key={lv.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-purple-600">#{lv.requestNo}</span> • <span>Destination: {lv.destination}</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium italic mt-0.5">&ldquo;{lv.reason}&rdquo;</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(lv.status)}`}>
                        {lv.status}
                      </span>
                      {lv.status === 'Approved' && (
                        <button
                          onClick={() => printLeavePass(lv, student)}
                          className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200 flex items-center"
                        >
                          <Printer className="w-3 h-3 mr-1" /> Pass
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    From {formatDate(lv.fromDate)} to {formatDate(lv.toDate)} • Remarks: {lv.actionRemarks || 'Pending'}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 6: Visitors */}
        {activeTab === 'visitors' && (
          <div className="space-y-3">
            {studentVisitors.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No visitors logged for this student.</div>
            ) : (
              studentVisitors.map(vis => (
                <div key={vis.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-teal-600">#{vis.visitorPassNo}</span> • <span className="font-bold">{vis.visitorName}</span> ({vis.relationship})
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">Phone: {vis.phone} • ID: {vis.idProof}</p>
                      <p className="text-slate-700 dark:text-slate-300 mt-1">Purpose: {vis.purpose}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(vis.status)}`}>
                      {vis.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Date: {formatDate(vis.visitDate)} • In: {vis.entryTime} {vis.exitTime ? `• Out: ${vis.exitTime}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
