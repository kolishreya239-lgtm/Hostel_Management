import React, { useState, useMemo } from 'react';
import {
  Search, Filter, UserPlus, Download, Eye, Edit2, Trash2,
  BedDouble, CreditCard, CalendarCheck, AlertTriangle, ChevronLeft,
  ChevronRight, MoreVertical, Building
} from 'lucide-react';
import { Student } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { StudentProfileModal } from './StudentProfileModal';
import { StudentFormModal } from './StudentFormModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useToast } from '../common/Toast';
import { EmptyState } from '../common/EmptyState';

interface StudentListProps {
  onOpenAllocateModal: (student?: Student) => void;
  onNavigateToModule: (module: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  onOpenAllocateModal,
  onNavigateToModule
}) => {
  const { students, hostels, deleteStudent } = useHostel();
  const { showToast } = useToast();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [hostelFilter, setHostelFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Unique options for filters
  const courses = useMemo(() => Array.from(new Set(students.map(s => s.course))), [students]);
  const years = useMemo(() => Array.from(new Set(students.map(s => s.year))), [students]);

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.rollNo.toLowerCase().includes(q) ||
        student.phone.toLowerCase().includes(q) ||
        student.roomNo.toLowerCase().includes(q);

      const matchesHostel = !hostelFilter || student.hostelId === hostelFilter;
      const matchesCourse = !courseFilter || student.course === courseFilter;
      const matchesYear = !yearFilter || student.year === yearFilter;
      const matchesGender = !genderFilter || student.gender === genderFilter;
      const matchesStatus = !statusFilter || student.status === statusFilter;

      return matchesSearch && matchesHostel && matchesCourse && matchesYear && matchesGender && matchesStatus;
    });
  }, [students, searchQuery, hostelFilter, courseFilter, yearFilter, genderFilter, statusFilter]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      showToast(`Student ${studentToDelete.name} has been deleted.`, 'danger');
      setStudentToDelete(null);
    }
  };

  const handleExport = () => {
    const exportData = filteredStudents.map(s => ({
      'Student ID': s.studentId,
      'Name': s.name,
      'Gender': s.gender,
      'Roll Number': s.rollNo,
      'Course': s.course,
      'Year': s.year,
      'Hostel': s.hostelName,
      'Room': s.roomNo,
      'Bed': s.bedNo,
      'Phone': s.phone,
      'Email': s.email,
      'Guardian Name': s.guardianName,
      'Guardian Phone': s.guardianPhone,
      'Status': s.status,
      'Admission Date': s.admissionDate
    }));
    exportToCSV(`HostelHub_Students_Report_${new Date().toISOString().split('T')[0]}`, exportData);
    showToast('Students directory exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Student Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total {students.length} resident scholars enrolled in hostel system
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
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, roll, room..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Hostel Filter */}
          <select
            value={hostelFilter}
            onChange={e => {
              setHostelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Hostels</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.code} – {h.name}</option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={e => {
              setCourseFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Courses</option>
            {courses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={e => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Secondary filters line */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Quick Filters:</span>
            {['Active', 'Inactive', 'Suspended'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(statusFilter === st ? '' : st)}
                className={`px-2.5 py-0.5 rounded-lg font-bold border transition-colors ${
                  statusFilter === st
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}

            {(searchQuery || hostelFilter || courseFilter || genderFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setHostelFilter('');
                  setCourseFilter('');
                  setGenderFilter('');
                  setStatusFilter('');
                }}
                className="text-xs text-rose-600 hover:underline font-bold ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <span className="text-slate-400 text-xs font-semibold">
            Showing {filteredStudents.length} of {students.length} students
          </span>
        </div>
      </div>

      {/* Students Data Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try clearing your search query or adjusting your filters to see student records."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setHostelFilter('');
            setCourseFilter('');
            setGenderFilter('');
            setStatusFilter('');
          }}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3">Gender</th>
                  <th className="py-3.5 px-3">Academic Program</th>
                  <th className="py-3.5 px-3">Room / Bed</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">Enrolled</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Student Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <p
                            onClick={() => setSelectedStudentForProfile(student)}
                            className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer"
                          >
                            {student.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {student.studentId} • Roll: {student.rollNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {student.gender}
                    </td>

                    {/* Academic */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{student.course}</p>
                      <p className="text-[11px] text-slate-400">{student.year} • {student.department}</p>
                    </td>

                    {/* Room & Bed */}
                    <td className="py-3 px-3">
                      {student.roomNo ? (
                        <div>
                          <span className="font-bold text-brand-600 dark:text-brand-400">
                            Room {student.roomNo}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {student.bedNo} ({student.hostelName.split(' ')[0]})
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenAllocateModal(student)}
                          className="text-[11px] font-bold text-amber-600 hover:underline"
                        >
                          + Allocate Bed
                        </button>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3">
                      <p className="text-slate-700 dark:text-slate-300">{student.phone}</p>
                      <p className="text-[11px] text-slate-400">{student.email}</p>
                    </td>

                    {/* Enrolled */}
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(student.admissionDate)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(student.status)}`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        {/* View Profile */}
                        <button
                          onClick={() => setSelectedStudentForProfile(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Complete Resident Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Allocate Bed */}
                        <button
                          onClick={() => onOpenAllocateModal(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Allocate / Change Bed"
                        >
                          <BedDouble className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setSelectedStudentForEdit(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Information"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-bold ${
                    currentPage === i + 1
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onOpenAllocateRoom={onOpenAllocateModal}
      />

      {/* Edit Student Modal */}
      <StudentFormModal
        isOpen={!!selectedStudentForEdit}
        onClose={() => setSelectedStudentForEdit(null)}
        initialData={selectedStudentForEdit}
      />

      {/* Add Student Modal */}
      <StudentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Student Deletion"
        message={`Are you sure you want to delete ${studentToDelete?.name} (${studentToDelete?.studentId})? Any allocated room will be automatically vacated.`}
        confirmLabel="Delete Student"
        isDestructive={true}
      />
    </div>
  );
};
