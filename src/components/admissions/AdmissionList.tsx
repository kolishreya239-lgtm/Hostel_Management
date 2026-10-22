import React, { useState } from 'react';
import {
  UserPlus, Search, Filter, CheckCircle2, XCircle, Clock,
  ArrowRight, ShieldCheck, Download, Eye, BedDouble
} from 'lucide-react';
import { AdmissionApplication } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { AdmissionFormModal } from './AdmissionFormModal';
import { useToast } from '../common/Toast';
import { Modal } from '../common/Modal';

export const AdmissionList: React.FC = () => {
  const { admissions, approveAdmission, rejectAdmission, waitlistAdmission, hostels } = useHostel();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  const filteredAdmissions = admissions.filter(app => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.applicationNo.toLowerCase().includes(q) ||
      app.rollNumber.toLowerCase().includes(q) ||
      app.course.toLowerCase().includes(q);

    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (app: AdmissionApplication) => {
    approveAdmission(app.id, 'Verified and approved by Admissions Office');
    showToast(`Application #${app.applicationNo} approved! Student enrolled & room allocated.`, 'success');
    if (selectedApp?.id === app.id) setSelectedApp(null);
  };

  const handleReject = (app: AdmissionApplication) => {
    rejectAdmission(app.id, 'Document criteria not met');
    showToast(`Application #${app.applicationNo} rejected.`, 'danger');
    if (selectedApp?.id === app.id) setSelectedApp(null);
  };

  const handleWaitlist = (app: AdmissionApplication) => {
    waitlistAdmission(app.id, 'Placed on reserve waitlist');
    showToast(`Application #${app.applicationNo} moved to waitlist.`, 'info');
    if (selectedApp?.id === app.id) setSelectedApp(null);
  };

  const handleExport = () => {
    const data = filteredAdmissions.map(a => ({
      'Application No': a.applicationNo,
      'Name': a.fullName,
      'Gender': a.gender,
      'Applied Date': a.appliedDate,
      'Course': a.course,
      'Department': a.department,
      'Roll Number': a.rollNumber,
      'Mobile': a.mobile,
      'Email': a.email,
      'Preferred Room Type': a.preferredRoomType,
      'Status': a.status
    }));
    exportToCSV(`HostelHub_Admissions_${new Date().toISOString().split('T')[0]}`, data);
    showToast('Admissions report exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hostel Admissions & Intake Workflow
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review incoming student applications, verify KYC proofs, and approve with automatic room allocation
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
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by applicant name, application #, roll number..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Waitlisted">Waitlisted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Application #</th>
                <th className="py-3.5 px-3">Applicant Name</th>
                <th className="py-3.5 px-3">Gender</th>
                <th className="py-3.5 px-3">Academic Program</th>
                <th className="py-3.5 px-3">Preferences</th>
                <th className="py-3.5 px-3">Applied Date</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAdmissions.map(app => {
                const hostelObj = hostels.find(h => h.id === app.preferredHostelId);

                return (
                  <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {app.applicationNo}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {app.fullName}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {app.mobile}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {app.gender}
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{app.course}</p>
                      <p className="text-[11px] text-slate-400">Roll: {app.rollNumber} • {app.year}</p>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {app.preferredRoomType} {app.preferredAC ? '(AC)' : ''}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Pref: {hostelObj?.name || 'Any'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {formatDate(app.appliedDate)}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Application Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {app.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center space-x-1"
                              title="Approve and Auto-Allocate Bed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => handleReject(app)}
                              className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-800"
                              title="Reject Application"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {app.status === 'Approved' && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Enrolled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Admission Dossier #${selectedApp.applicationNo}`}
          subtitle={`Applicant: ${selectedApp.fullName} • Status: ${selectedApp.status}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400">Full Legal Name:</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedApp.fullName}</p>
              </div>
              <div>
                <span className="text-slate-400">Gender / DOB:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.gender} • {formatDate(selectedApp.dob)}</p>
              </div>
              <div>
                <span className="text-slate-400">Contact:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.mobile} • {selectedApp.email}</p>
              </div>
              <div>
                <span className="text-slate-400">Blood Group:</span>
                <p className="font-bold text-rose-600">{selectedApp.bloodGroup}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Permanent Address:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400">Academic Program:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.course} ({selectedApp.year})</p>
              </div>
              <div>
                <span className="text-slate-400">College Roll / App:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.rollNumber}</p>
              </div>
              <div>
                <span className="text-slate-400">Guardian Name & Phone:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.guardianName} ({selectedApp.guardianRelation}) • {selectedApp.guardianPhone}</p>
              </div>
              <div>
                <span className="text-slate-400">Emergency Phone:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.emergencyContact}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-400">Preference & Status Remarks:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                Requested: {selectedApp.preferredRoomType} ({selectedApp.preferredAC ? 'AC' : 'Non-AC'})
              </p>
              {selectedApp.reviewRemarks && (
                <p className="mt-1 text-slate-500 italic">
                  &ldquo;{selectedApp.reviewRemarks}&rdquo;
                </p>
              )}
            </div>

            {selectedApp.status === 'Pending' && (
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  onClick={() => handleReject(selectedApp)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                >
                  Decline Application
                </button>
                <button
                  onClick={() => handleWaitlist(selectedApp)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                >
                  Move to Waitlist
                </button>
                <button
                  onClick={() => handleApprove(selectedApp)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  Approve & Auto-Allocate Bed
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* New Application Form Modal */}
      <AdmissionFormModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
