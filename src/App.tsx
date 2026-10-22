import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useHostel } from './context/HostelContext';
import { Student, Room } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Breadcrumb } from './components/common/Breadcrumb';
import { SearchModal } from './components/common/SearchModal';

// Landing Page
import { LandingPage } from './components/landing/LandingPage';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { WardenDashboard } from './components/dashboard/WardenDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AccountantDashboard } from './components/dashboard/AccountantDashboard';

// Module Views
import { StudentList } from './components/students/StudentList';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { StudentFormModal } from './components/students/StudentFormModal';
import { SmartAllocationModal } from './components/allocation/SmartAllocationModal';
import { HostelList } from './components/hostels/HostelList';
import { RoomGrid } from './components/hostels/RoomGrid';
import { FloorView } from './components/hostels/FloorView';
import { AdmissionList } from './components/admissions/AdmissionList';
import { AdmissionFormModal } from './components/admissions/AdmissionFormModal';
import { AttendanceSheet } from './components/attendance/AttendanceSheet';
import { FeeManagement } from './components/fees/FeeManagement';
import { RecordPaymentModal } from './components/fees/RecordPaymentModal';
import { ComplaintList } from './components/complaints/ComplaintList';
import { ComplaintModal } from './components/complaints/ComplaintModal';
import { MaintenanceList } from './components/maintenance/MaintenanceList';
import { LeaveList } from './components/leaves/LeaveList';
import { ApplyLeaveModal } from './components/leaves/ApplyLeaveModal';
import { VisitorLog } from './components/visitors/VisitorLog';
import { VisitorModal } from './components/visitors/VisitorModal';
import { NoticeBoard } from './components/notices/NoticeBoard';
import { NoticeFormModal } from './components/notices/NoticeFormModal';
import { MessMenu } from './components/mess/MessMenu';
import { MessFeedbackModal } from './components/mess/MessFeedbackModal';
import { InventoryList } from './components/inventory/InventoryList';
import { StaffList } from './components/staff/StaffList';
import { ReportsCenter } from './components/reports/ReportsCenter';
import { SettingsPage } from './components/settings/SettingsPage';

export const App: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { students } = useHostel();

  // Navigation & View Mode
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [selectedHostelFilter, setSelectedHostelFilter] = useState<string>('');

  // Sidebar Layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop

  // Search Modal (Ctrl+K)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Quick Modals
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [allocateStudent, setAllocateStudent] = useState<Student | null>(null);
  const [allocateRoom, setAllocateRoom] = useState<Room | null>(null);
  const [allocateBed, setAllocateBed] = useState<string | undefined>();

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isVisitorOpen, setIsVisitorOpen] = useState(false);
  const [isAdmissionFormOpen, setIsAdmissionFormOpen] = useState(false);
  const [isMessFeedbackOpen, setIsMessFeedbackOpen] = useState(false);

  // Student Profile Dossier Modal
  const [selectedStudentForDossier, setSelectedStudentForDossier] = useState<Student | null>(null);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (module: string, entityId?: string) => {
    setIsLandingPage(false);

    if (module === 'landing') {
      setIsLandingPage(true);
      return;
    }

    if (module === 'allocation') {
      setIsAllocateModalOpen(true);
      return;
    }

    if (module === 'add-student') {
      setStudentToEdit(null);
      setIsStudentFormOpen(true);
      return;
    }

    if (module === 'record-payment') {
      setIsRecordPaymentOpen(true);
      return;
    }

    if (module === 'add-notice') {
      setIsNoticeFormOpen(true);
      return;
    }

    if (module === 'add-complaint') {
      setIsComplaintOpen(true);
      return;
    }

    if (module === 'apply-leave') {
      setIsLeaveOpen(true);
      return;
    }

    if (module === 'register-visitor') {
      setIsVisitorOpen(true);
      return;
    }

    if (module === 'apply-admission') {
      setIsAdmissionFormOpen(true);
      return;
    }

    // Direct student lookup by ID
    if (module === 'student-profile' && entityId) {
      const found = students.find(s => s.id === entityId || s.studentId === entityId);
      if (found) {
        setSelectedStudentForDossier(found);
        return;
      }
    }

    setCurrentModule(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAllocateModal = (student?: Student, room?: Room, bedNo?: string) => {
    setAllocateStudent(student || null);
    setAllocateRoom(room || null);
    setAllocateBed(bedNo);
    setIsAllocateModalOpen(true);
  };

  // Render Landing Page if toggled
  if (isLandingPage) {
    return (
      <LandingPage
        onEnterDashboard={() => {
          setIsLandingPage(false);
          setCurrentModule('dashboard');
        }}
      />
    );
  }

  // Active Dashboard component depending on current logged-in role
  const renderDashboard = () => {
    switch (currentRole) {
      case 'warden':
        return (
          <WardenDashboard
            onNavigate={handleNavigate}
            onOpenNoticeModal={() => setIsNoticeFormOpen(true)}
          />
        );
      case 'student':
        return (
          <StudentDashboard
            onNavigate={handleNavigate}
            onOpenComplaintModal={() => setIsComplaintOpen(true)}
            onOpenLeaveModal={() => setIsLeaveOpen(true)}
            onOpenVisitorModal={() => setIsVisitorOpen(true)}
          />
        );
      case 'accountant':
        return (
          <AccountantDashboard
            onNavigate={handleNavigate}
            onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            onOpenInvoiceModal={() => setCurrentModule('fees')}
          />
        );
      case 'staff':
        return (
          <WardenDashboard
            onNavigate={handleNavigate}
            onOpenNoticeModal={() => setIsNoticeFormOpen(true)}
          />
        );
      case 'admin':
      default:
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
            onOpenAddStudent={() => {
              setStudentToEdit(null);
              setIsStudentFormOpen(true);
            }}
            onOpenAllocateModal={() => handleOpenAllocateModal()}
            onOpenRecordPayment={() => setIsRecordPaymentOpen(true)}
            onOpenAddNotice={() => setIsNoticeFormOpen(true)}
          />
        );
    }
  };

  // Main Module Router
  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return renderDashboard();

      case 'students':
        return (
          <StudentList
            onOpenAllocateModal={handleOpenAllocateModal}
            onNavigateToModule={handleNavigate}
          />
        );

      case 'profile':
      case 'my-room': {
        const loggedInStudent = students.find(
          s => s.studentId === currentUser?.studentId || s.email === currentUser?.email
        ) || students[0];
        return (
          <StudentDashboard
            onNavigate={handleNavigate}
            onOpenComplaintModal={() => setIsComplaintOpen(true)}
            onOpenLeaveModal={() => setIsLeaveOpen(true)}
            onOpenVisitorModal={() => setIsVisitorOpen(true)}
          />
        );
      }

      case 'admissions':
        return <AdmissionList />;

      case 'hostels':
        return (
          <HostelList
            onSelectHostel={(hostelId) => {
              setSelectedHostelFilter(hostelId);
              setCurrentModule('rooms');
            }}
            onNavigateToRooms={() => setCurrentModule('rooms')}
          />
        );

      case 'rooms':
        return (
          <RoomGrid
            initialHostelFilter={selectedHostelFilter}
            onOpenAllocateModal={handleOpenAllocateModal}
          />
        );

      case 'floors':
        return <FloorView onOpenAllocateModal={handleOpenAllocateModal} />;

      case 'attendance':
        return <AttendanceSheet />;

      case 'fees':
        return <FeeManagement />;

      case 'complaints':
        return <ComplaintList />;

      case 'maintenance':
        return <MaintenanceList />;

      case 'leave':
        return <LeaveList />;

      case 'visitors':
        return <VisitorLog />;

      case 'notices':
        return <NoticeBoard />;

      case 'mess':
        return <MessMenu />;

      case 'inventory':
        return <InventoryList />;

      case 'staff':
        return <StaffList />;

      case 'reports':
        return <ReportsCenter />;

      case 'settings':
        return <SettingsPage />;

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Body Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Breadcrumb path */}
          <Breadcrumb
            currentModule={currentModule}
            onNavigateHome={() => setCurrentModule('dashboard')}
          />

          {/* Active View */}
          {renderModuleContent()}
        </main>
      </div>

      {/* Global Command Search (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(mod, entityId) => {
          setIsSearchOpen(false);
          handleNavigate(mod, entityId);
        }}
      />

      {/* Global Modals */}
      <SmartAllocationModal
        isOpen={isAllocateModalOpen}
        onClose={() => {
          setIsAllocateModalOpen(false);
          setAllocateStudent(null);
          setAllocateRoom(null);
          setAllocateBed(undefined);
        }}
        preselectedStudent={allocateStudent}
        preselectedRoom={allocateRoom}
        preselectedBed={allocateBed}
      />

      <StudentFormModal
        isOpen={isStudentFormOpen}
        onClose={() => {
          setIsStudentFormOpen(false);
          setStudentToEdit(null);
        }}
        initialData={studentToEdit}
      />

      {selectedStudentForDossier && (
        <StudentProfileModal
          student={selectedStudentForDossier}
          isOpen={!!selectedStudentForDossier}
          onClose={() => setSelectedStudentForDossier(null)}
          onEdit={(stu: Student) => {
            setSelectedStudentForDossier(null);
            setStudentToEdit(stu);
            setIsStudentFormOpen(true);
          }}
        />
      )}

      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
      />

      <NoticeFormModal
        isOpen={isNoticeFormOpen}
        onClose={() => setIsNoticeFormOpen(false)}
      />

      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />

      <ApplyLeaveModal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
      />

      <VisitorModal
        isOpen={isVisitorOpen}
        onClose={() => setIsVisitorOpen(false)}
      />

      <AdmissionFormModal
        isOpen={isAdmissionFormOpen}
        onClose={() => setIsAdmissionFormOpen(false)}
      />

      <MessFeedbackModal
        isOpen={isMessFeedbackOpen}
        onClose={() => setIsMessFeedbackOpen(false)}
      />
    </div>
  );
};

export default App;
