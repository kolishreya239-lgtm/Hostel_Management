import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student, Hostel, Floor, Room, AdmissionApplication, FeeInvoice,
  PaymentTransaction, AttendanceRecord, Complaint, MaintenanceRequest,
  LeaveRequest, Visitor, Notice, MessDailyMenu, MessFeedback, InventoryItem,
  Staff, AppNotification, ActivityLog, RoomType
} from '../types';
import {
  INITIAL_STUDENTS, INITIAL_HOSTELS, INITIAL_FLOORS, INITIAL_ROOMS,
  INITIAL_ADMISSIONS, INITIAL_INVOICES, INITIAL_PAYMENTS, INITIAL_ATTENDANCE,
  INITIAL_COMPLAINTS, INITIAL_MAINTENANCE, INITIAL_LEAVES, INITIAL_VISITORS,
  INITIAL_NOTICES, INITIAL_MESS_MENU, INITIAL_MESS_FEEDBACK, INITIAL_INVENTORY,
  INITIAL_STAFF, INITIAL_NOTIFICATIONS, INITIAL_ACTIVITY_LOGS
} from '../data/initialData';

interface DashboardStats {
  totalStudents: number;
  totalRooms: number;
  occupiedBeds: number;
  availableBeds: number;
  pendingFees: number;
  totalCollectedFees: number;
  pendingComplaints: number;
  pendingLeaves: number;
  openMaintenance: number;
  occupancyRate: number;
}

interface HostelContextType {
  // State
  students: Student[];
  hostels: Hostel[];
  floors: Floor[];
  rooms: Room[];
  admissions: AdmissionApplication[];
  invoices: FeeInvoice[];
  payments: PaymentTransaction[];
  attendance: AttendanceRecord[];
  complaints: Complaint[];
  maintenance: MaintenanceRequest[];
  leaves: LeaveRequest[];
  visitors: Visitor[];
  notices: Notice[];
  messMenu: MessDailyMenu[];
  messFeedbacks: MessFeedback[];
  inventory: InventoryItem[];
  staff: Staff[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
  stats: DashboardStats;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;

  // Room & Bed Allocation Actions
  allocateRoom: (
    studentId: string,
    hostelId: string,
    floorNo: number,
    roomNo: string,
    bedNo: string,
    checkInDate: string
  ) => { success: boolean; message: string };
  autoAllocateRoom: (
    studentId: string,
    preferredHostelId?: string,
    preferredRoomType?: RoomType
  ) => { success: boolean; message: string; roomNo?: string; bedNo?: string };
  deallocateRoom: (studentId: string) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;

  // Admission Actions
  submitAdmission: (application: Omit<AdmissionApplication, 'id' | 'applicationNo' | 'status' | 'appliedDate'>) => AdmissionApplication;
  approveAdmission: (id: string, remarks?: string) => void;
  rejectAdmission: (id: string, remarks?: string) => void;
  waitlistAdmission: (id: string, remarks?: string) => void;

  // Fee & Payment Actions
  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNo'>) => PaymentTransaction;
  createInvoice: (invoice: Omit<FeeInvoice, 'id' | 'invoiceNo' | 'createdAt'>) => FeeInvoice;

  // Attendance Actions
  markAttendance: (records: { studentId: string; status: 'Present' | 'Absent' | 'Late' | 'On Leave'; remarks?: string }[], markedBy: string, date: string) => void;

  // Complaint Actions
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'complaintNo' | 'status' | 'createdAt'>) => Complaint;
  assignComplaint: (complaintId: string, staffId: string, staffName: string) => void;
  updateComplaintStatus: (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => void;

  // Maintenance Actions
  createMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'requestNo' | 'createdDate' | 'status'>) => MaintenanceRequest;
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status']) => void;

  // Leave Actions
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'requestNo' | 'status' | 'appliedDate'>) => LeaveRequest;
  approveLeave: (id: string, approvedBy: string, remarks?: string) => void;
  rejectLeave: (id: string, approvedBy: string, remarks?: string) => void;

  // Visitor Actions
  registerVisitor: (visitor: Omit<Visitor, 'id' | 'visitorPassNo' | 'status'>) => Visitor;
  checkInVisitor: (id: string) => void;
  checkOutVisitor: (id: string) => void;

  // Notice Actions
  addNotice: (notice: Omit<Notice, 'id' | 'publishedDate'>) => Notice;
  deleteNotice: (id: string) => void;
  togglePinNotice: (id: string) => void;

  // Mess Actions
  updateMessDayMenu: (day: MessDailyMenu['day'], menuUpdates: Partial<MessDailyMenu>) => void;
  submitMessFeedback: (fb: Omit<MessFeedback, 'id' | 'date'>) => void;

  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'itemCode'>) => InventoryItem;
  updateInventoryStock: (id: string, delta: number, type: 'in' | 'out' | 'damage') => void;

  // Staff Actions
  addStaff: (stf: Omit<Staff, 'id' | 'staffId'>) => Staff;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Notifications Actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Reset Demo Data
  resetToDefaultData: () => void;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`hostelhub_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(`hostelhub_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
};

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [hostels, setHostels] = useState<Hostel[]>(() => loadFromStorage('hostels', INITIAL_HOSTELS));
  const [floors, setFloors] = useState<Floor[]>(() => loadFromStorage('floors', INITIAL_FLOORS));
  const [rooms, setRooms] = useState<Room[]>(() => loadFromStorage('rooms', INITIAL_ROOMS));
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => loadFromStorage('admissions', INITIAL_ADMISSIONS));
  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => loadFromStorage('invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', INITIAL_ATTENDANCE));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadFromStorage('complaints', INITIAL_COMPLAINTS));
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => loadFromStorage('maintenance', INITIAL_MAINTENANCE));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => loadFromStorage('leaves', INITIAL_LEAVES));
  const [visitors, setVisitors] = useState<Visitor[]>(() => loadFromStorage('visitors', INITIAL_VISITORS));
  const [notices, setNotices] = useState<Notice[]>(() => loadFromStorage('notices', INITIAL_NOTICES));
  const [messMenu, setMessMenu] = useState<MessDailyMenu[]>(() => loadFromStorage('messMenu', INITIAL_MESS_MENU));
  const [messFeedbacks, setMessFeedbacks] = useState<MessFeedback[]>(() => loadFromStorage('messFeedbacks', INITIAL_MESS_FEEDBACK));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadFromStorage('inventory', INITIAL_INVENTORY));
  const [staff, setStaff] = useState<Staff[]>(() => loadFromStorage('staff', INITIAL_STAFF));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadFromStorage('activityLogs', INITIAL_ACTIVITY_LOGS));

  // Sync to storage
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('hostels', hostels), [hostels]);
  useEffect(() => saveToStorage('floors', floors), [floors]);
  useEffect(() => saveToStorage('rooms', rooms), [rooms]);
  useEffect(() => saveToStorage('admissions', admissions), [admissions]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('attendance', attendance), [attendance]);
  useEffect(() => saveToStorage('complaints', complaints), [complaints]);
  useEffect(() => saveToStorage('maintenance', maintenance), [maintenance]);
  useEffect(() => saveToStorage('leaves', leaves), [leaves]);
  useEffect(() => saveToStorage('visitors', visitors), [visitors]);
  useEffect(() => saveToStorage('notices', notices), [notices]);
  useEffect(() => saveToStorage('messMenu', messMenu), [messMenu]);
  useEffect(() => saveToStorage('messFeedbacks', messFeedbacks), [messFeedbacks]);
  useEffect(() => saveToStorage('inventory', inventory), [inventory]);
  useEffect(() => saveToStorage('staff', staff), [staff]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('activityLogs', activityLogs), [activityLogs]);

  // Compute dynamic stats
  const totalStudents = students.length;
  const totalRooms = rooms.length;
  let occupiedBeds = 0;
  let totalBeds = 0;
  rooms.forEach(r => {
    occupiedBeds += r.occupiedBeds;
    totalBeds += r.capacity;
  });
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalCollectedFees = payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingFees = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Overdue' || i.status === 'Partially Paid')
    .reduce((acc, i) => acc + (i.amount - i.paidAmount), 0);

  const pendingComplaints = complaints.filter(c => c.status === 'Submitted' || c.status === 'Assigned' || c.status === 'In Progress').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const openMaintenance = maintenance.filter(m => m.status === 'Open' || m.status === 'In Progress' || m.status === 'Urgent').length;

  const stats: DashboardStats = {
    totalStudents,
    totalRooms,
    occupiedBeds,
    availableBeds,
    pendingFees,
    totalCollectedFees,
    pendingComplaints,
    pendingLeaves,
    openMaintenance,
    occupancyRate
  };

  const logActivity = (action: string, actor: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      action,
      actor,
      timestamp: 'Just now',
      type
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 24)]);
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'], link?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const id = `stu-${Date.now()}`;
    const newStudent: Student = { ...studentData, id };
    setStudents(prev => [newStudent, ...prev]);
    logActivity(`Added student ${newStudent.name} (${newStudent.studentId})`, 'Admin', 'admission');
    addNotification('Student Enrolled', `${newStudent.name} successfully registered in hostel database.`, 'success', 'students');
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    logActivity(`Updated profile details for student ID: ${id}`, 'Admin', 'admission');
  };

  const deleteStudent = (id: string) => {
    const stu = students.find(s => s.id === id);
    if (stu && stu.roomNo && stu.bedNo) {
      deallocateRoom(stu.id);
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    if (stu) {
      logActivity(`Deleted student record: ${stu.name}`, 'Admin', 'admission');
    }
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id || s.studentId === id);
  };

  // Room & Bed Allocation
  const allocateRoom = (
    studentId: string,
    hostelId: string,
    floorNo: number,
    roomNo: string,
    bedNo: string,
    checkInDate: string
  ): { success: boolean; message: string } => {
    const student = students.find(s => s.id === studentId || s.studentId === studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const targetRoom = rooms.find(r => r.roomNumber === roomNo && r.hostelId === hostelId);
    if (!targetRoom) return { success: false, message: 'Target room not found.' };

    // Check capacity
    if (targetRoom.availableBeds <= 0 && !targetRoom.beds.some(b => b.bedNumber === bedNo && b.studentId === student.studentId)) {
      return { success: false, message: `Room ${roomNo} is already at full capacity (${targetRoom.capacity}/${targetRoom.capacity} beds occupied).` };
    }

    // Check specific bed
    const targetBed = targetRoom.beds.find(b => b.bedNumber === bedNo);
    if (targetBed && targetBed.isOccupied && targetBed.studentId !== student.studentId) {
      return { success: false, message: `${bedNo} in Room ${roomNo} is already occupied by ${targetBed.studentName || 'another student'}.` };
    }

    // Remove old allocation if any
    if (student.roomNo && student.bedNo) {
      rooms.forEach(r => {
        if (r.roomNumber === student.roomNo) {
          r.beds.forEach(b => {
            if (b.bedNumber === student.bedNo && b.studentId === student.studentId) {
              b.isOccupied = false;
              delete b.studentId;
              delete b.studentName;
              delete b.checkInDate;
            }
          });
          r.occupiedBeds = r.beds.filter(b => b.isOccupied).length;
          r.availableBeds = r.capacity - r.occupiedBeds;
          r.status = r.occupiedBeds === 0 ? 'Available' : r.occupiedBeds >= r.capacity ? 'Full' : 'Partially Occupied';
        }
      });
    }

    // Apply new allocation to room
    const updatedRooms = rooms.map(r => {
      if (r.id === targetRoom.id) {
        const updatedBeds = r.beds.map(b => {
          if (b.bedNumber === bedNo) {
            return {
              ...b,
              isOccupied: true,
              studentId: student.studentId,
              studentName: student.name,
              checkInDate
            };
          }
          return b;
        });

        const newOccupied = updatedBeds.filter(b => b.isOccupied).length;
        const newAvailable = Math.max(0, r.capacity - newOccupied);
        const newStatus: Room['status'] = newOccupied >= r.capacity ? 'Full' : newOccupied > 0 ? 'Partially Occupied' : 'Available';

        return {
          ...r,
          beds: updatedBeds,
          occupiedBeds: newOccupied,
          availableBeds: newAvailable,
          status: newStatus
        };
      }
      return r;
    });

    setRooms(updatedRooms);

    // Update Student Record
    const hostelObj = hostels.find(h => h.id === hostelId);
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          hostelId,
          hostelName: hostelObj ? hostelObj.name : s.hostelName,
          floorNo,
          roomNo,
          bedNo,
          admissionDate: checkInDate
        };
      }
      return s;
    }));

    logActivity(`Allocated ${student.name} to Room ${roomNo} (${bedNo})`, 'Admin', 'allocation');
    addNotification('Room Allocation Confirmed', `${student.name} assigned to Room ${roomNo} (${bedNo}) at ${hostelObj?.name || 'Hostel'}.`, 'success', 'rooms');

    return { success: true, message: `Successfully allocated Room ${roomNo} (${bedNo}) to ${student.name}!` };
  };

  const autoAllocateRoom = (
    studentId: string,
    preferredHostelId?: string,
    preferredRoomType?: RoomType
  ): { success: boolean; message: string; roomNo?: string; bedNo?: string } => {
    const student = students.find(s => s.id === studentId || s.studentId === studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    // Filter available rooms matching gender & preferences
    const eligibleHostels = hostels.filter(h => {
      if (student.gender === 'Female') return h.type === 'Girls' || h.type === 'Co-ed';
      if (student.gender === 'Male') return h.type === 'Boys' || h.type === 'Co-ed';
      return true;
    });

    const eligibleHostelIds = eligibleHostels.map(h => h.id);

    let candidates = rooms.filter(r => eligibleHostelIds.includes(r.hostelId) && r.availableBeds > 0 && r.status !== 'Maintenance');

    if (preferredHostelId) {
      const preferredCandidates = candidates.filter(r => r.hostelId === preferredHostelId);
      if (preferredCandidates.length > 0) {
        candidates = preferredCandidates;
      }
    }

    if (preferredRoomType) {
      const typeCandidates = candidates.filter(r => r.type === preferredRoomType);
      if (typeCandidates.length > 0) {
        candidates = typeCandidates;
      }
    }

    if (candidates.length === 0) {
      return { success: false, message: 'No suitable rooms currently available matching criteria.' };
    }

    // Select the best candidate (least occupied first or first available)
    const selectedRoom = candidates[0];
    const availableBed = selectedRoom.beds.find(b => !b.isOccupied);

    if (!availableBed) {
      return { success: false, message: 'No available bed found in candidate room.' };
    }

    const res = allocateRoom(
      student.id,
      selectedRoom.hostelId,
      selectedRoom.floorNumber,
      selectedRoom.roomNumber,
      availableBed.bedNumber,
      new Date().toISOString().split('T')[0]
    );

    if (res.success) {
      return {
        success: true,
        message: `Auto-allocated Room ${selectedRoom.roomNumber} (${availableBed.bedNumber})!`,
        roomNo: selectedRoom.roomNumber,
        bedNo: availableBed.bedNumber
      };
    }

    return res;
  };

  const deallocateRoom = (studentId: string) => {
    const student = students.find(s => s.id === studentId || s.studentId === studentId);
    if (!student || !student.roomNo) return;

    const oldRoomNo = student.roomNo;
    const oldBedNo = student.bedNo;

    const updatedRooms = rooms.map(r => {
      if (r.roomNumber === oldRoomNo) {
        const updatedBeds = r.beds.map(b => {
          if (b.bedNumber === oldBedNo) {
            return { bedNumber: b.bedNumber, isOccupied: false };
          }
          return b;
        });
        const occupied = updatedBeds.filter(b => b.isOccupied).length;
        const avail = r.capacity - occupied;
        return {
          ...r,
          beds: updatedBeds,
          occupiedBeds: occupied,
          availableBeds: avail,
          status: (occupied === 0 ? 'Available' : occupied >= r.capacity ? 'Full' : 'Partially Occupied') as Room['status']
        };
      }
      return r;
    });

    setRooms(updatedRooms);

    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          roomNo: '',
          bedNo: '',
          floorNo: 0,
          hostelId: '',
          hostelName: 'Unassigned'
        };
      }
      return s;
    }));

    logActivity(`Vacated Room ${oldRoomNo} (${oldBedNo}) previously held by ${student.name}`, 'Admin', 'allocation');
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Admission Actions
  const submitAdmission = (applicationData: Omit<AdmissionApplication, 'id' | 'applicationNo' | 'status' | 'appliedDate'>): AdmissionApplication => {
    const appNo = `APP2026${Math.floor(100 + Math.random() * 900)}`;
    const newApp: AdmissionApplication = {
      ...applicationData,
      id: `adm-${Date.now()}`,
      applicationNo: appNo,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setAdmissions(prev => [newApp, ...prev]);
    logActivity(`New admission application received: ${newApp.fullName} (${newApp.course})`, 'Public Applicant', 'admission');
    addNotification('New Admission Application', `${newApp.fullName} applied for ${newApp.preferredRoomType}.`, 'info', 'admissions');
    return newApp;
  };

  const approveAdmission = (id: string, remarks?: string) => {
    const app = admissions.find(a => a.id === id);
    if (!app) return;

    setAdmissions(prev => prev.map(a => (a.id === id ? {
      ...a,
      status: 'Approved',
      reviewedDate: new Date().toISOString().split('T')[0],
      reviewRemarks: remarks || 'Documents verified. Admission approved.'
    } : a)));

    // Create student record automatically
    const newStudentId = `STU2026${String(students.length + 1).padStart(3, '0')}`;
    const studentData: Omit<Student, 'id'> = {
      studentId: newStudentId,
      name: app.fullName,
      photo: app.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      gender: app.gender,
      dob: app.dob,
      email: app.email,
      phone: app.mobile,
      address: app.address,
      college: app.college,
      department: app.department,
      course: app.course,
      year: app.year,
      rollNo: app.rollNumber,
      guardianName: app.guardianName,
      guardianRelation: app.guardianRelation,
      guardianPhone: app.guardianPhone,
      guardianEmail: app.guardianEmail,
      emergencyContact: app.emergencyContact,
      bloodGroup: app.bloodGroup,
      medicalNotes: app.medicalNotes,
      hostelId: app.preferredHostelId,
      hostelName: hostels.find(h => h.id === app.preferredHostelId)?.name || 'Hostel',
      floorNo: 1,
      roomNo: '',
      bedNo: '',
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0]
    };

    const created = addStudent(studentData);
    // Auto-allocate bed!
    autoAllocateRoom(created.id, app.preferredHostelId, app.preferredRoomType);

    logActivity(`Approved admission #${app.applicationNo} for ${app.fullName}`, 'Admin', 'admission');
  };

  const rejectAdmission = (id: string, remarks?: string) => {
    setAdmissions(prev => prev.map(a => (a.id === id ? {
      ...a,
      status: 'Rejected',
      reviewedDate: new Date().toISOString().split('T')[0],
      reviewRemarks: remarks || 'Application rejected due to document mismatch or criteria.'
    } : a)));
  };

  const waitlistAdmission = (id: string, remarks?: string) => {
    setAdmissions(prev => prev.map(a => (a.id === id ? {
      ...a,
      status: 'Waitlisted',
      reviewedDate: new Date().toISOString().split('T')[0],
      reviewRemarks: remarks || 'Placed on waitlist pending vacancy.'
    } : a)));
  };

  // Fees & Payments
  const recordPayment = (paymentData: Omit<PaymentTransaction, 'id' | 'receiptNo'>): PaymentTransaction => {
    const receiptNo = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNo
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update invoice if linked
    if (paymentData.invoiceId) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === paymentData.invoiceId) {
          const newPaid = inv.paidAmount + paymentData.amount;
          const newStatus: FeeInvoice['status'] = newPaid >= inv.amount ? 'Paid' : newPaid > 0 ? 'Partially Paid' : inv.status;
          return { ...inv, paidAmount: newPaid, status: newStatus };
        }
        return inv;
      }));
    }

    logActivity(`Payment of ${paymentData.amount} recorded for ${paymentData.studentName} (${paymentData.paymentMethod})`, 'Accountant', 'fee');
    addNotification('Payment Received', `₹${paymentData.amount} received from ${paymentData.studentName}. Receipt #${receiptNo} generated.`, 'success', 'fees');

    return newPayment;
  };

  const createInvoice = (invoiceData: Omit<FeeInvoice, 'id' | 'invoiceNo' | 'createdAt'>): FeeInvoice => {
    const invoiceNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: FeeInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNo,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  // Attendance
  const markAttendance = (records: { studentId: string; status: AttendanceRecord['status']; remarks?: string }[], markedBy: string, date: string) => {
    const newRecords: AttendanceRecord[] = records.map(r => {
      const student = students.find(s => s.studentId === r.studentId || s.id === r.studentId);
      return {
        id: `att-${Date.now()}-${r.studentId}`,
        studentId: student?.studentId || r.studentId,
        studentName: student?.name || 'Student',
        roomNo: student?.roomNo || 'Unassigned',
        hostelId: student?.hostelId || 'h-1',
        date,
        status: r.status,
        markedBy,
        remarks: r.remarks
      };
    });

    // Replace records for the same date & student, or append
    setAttendance(prev => {
      const filtered = prev.filter(p => !(p.date === date && records.some(r => r.studentId === p.studentId)));
      return [...newRecords, ...filtered];
    });

    logActivity(`Attendance marked for ${records.length} students on ${date}`, markedBy, 'notice');
    addNotification('Attendance Marked', `Daily attendance roster submitted for ${date}.`, 'info', 'attendance');
  };

  // Complaints
  const submitComplaint = (compData: Omit<Complaint, 'id' | 'complaintNo' | 'status' | 'createdAt'>): Complaint => {
    const complaintNo = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: Complaint = {
      ...compData,
      id: `cmp-${Date.now()}`,
      complaintNo,
      status: 'Submitted',
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    setComplaints(prev => [newComplaint, ...prev]);
    logActivity(`Complaint #${complaintNo} submitted by ${newComplaint.studentName} (${newComplaint.category})`, newComplaint.studentName, 'complaint');
    addNotification('New Complaint Raised', `${newComplaint.subject} at ${newComplaint.location}.`, 'warning', 'complaints');
    return newComplaint;
  };

  const assignComplaint = (complaintId: string, staffId: string, staffName: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'Assigned',
          assignedStaffId: staffId,
          assignedStaffName: staffName
        };
      }
      return c;
    }));
    logActivity(`Complaint assigned to ${staffName}`, 'Admin', 'complaint');
  };

  const updateComplaintStatus = (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status,
          resolutionNotes: resolutionNotes || c.resolutionNotes,
          resolvedAt: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : c.resolvedAt
        };
      }
      return c;
    }));
    logActivity(`Complaint status updated to ${status}`, 'Staff', 'complaint');
  };

  // Maintenance
  const createMaintenanceRequest = (reqData: Omit<MaintenanceRequest, 'id' | 'requestNo' | 'createdDate' | 'status'>): MaintenanceRequest => {
    const requestNo = `MNT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: MaintenanceRequest = {
      ...reqData,
      id: `mnt-${Date.now()}`,
      requestNo,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setMaintenance(prev => [newReq, ...prev]);
    logActivity(`Maintenance order #${requestNo} raised for Room ${newReq.roomNo}`, 'Warden', 'maintenance');
    return newReq;
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceRequest['status']) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : m.completedDate
        };
      }
      return m;
    }));
  };

  // Leaves
  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'requestNo' | 'status' | 'appliedDate'>): LeaveRequest => {
    const requestNo = `LV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `lv-${Date.now()}`,
      requestNo,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaves(prev => [newLeave, ...prev]);
    logActivity(`Leave application #${requestNo} submitted by ${newLeave.studentName}`, newLeave.studentName, 'leave');
    addNotification('New Leave Application', `${newLeave.studentName} applied for leave from ${newLeave.fromDate} to ${newLeave.toDate}.`, 'info', 'leave');
    return newLeave;
  };

  const approveLeave = (id: string, approvedBy: string, remarks?: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'Approved',
          actionDate: new Date().toISOString().split('T')[0],
          actionRemarks: remarks || 'Approved by Warden after parental check.',
          approvedBy
        };
      }
      return l;
    }));
    logActivity(`Leave request #${id} approved by ${approvedBy}`, approvedBy, 'leave');
    addNotification('Leave Approved', `Your outstation leave pass is approved and active.`, 'success', 'leave');
  };

  const rejectLeave = (id: string, approvedBy: string, remarks?: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'Rejected',
          actionDate: new Date().toISOString().split('T')[0],
          actionRemarks: remarks || 'Request declined.',
          approvedBy
        };
      }
      return l;
    }));
  };

  // Visitors
  const registerVisitor = (visitorData: Omit<Visitor, 'id' | 'visitorPassNo' | 'status'>): Visitor => {
    const visitorPassNo = `VIS-2026-${Math.floor(500 + Math.random() * 500)}`;
    const newVisitor: Visitor = {
      ...visitorData,
      id: `vis-${Date.now()}`,
      visitorPassNo,
      status: 'Expected'
    };
    setVisitors(prev => [newVisitor, ...prev]);
    logActivity(`Visitor pass created for ${newVisitor.visitorName} visiting ${newVisitor.studentName}`, 'Security', 'visitor');
    return newVisitor;
  };

  const checkInVisitor = (id: string) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => (v.id === id ? { ...v, status: 'Checked In', entryTime: nowTime } : v)));
    logActivity(`Visitor checked in`, 'Security', 'visitor');
  };

  const checkOutVisitor = (id: string) => {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => (v.id === id ? { ...v, status: 'Checked Out', exitTime: nowTime } : v)));
    logActivity(`Visitor checked out`, 'Security', 'visitor');
  };

  // Notices
  const addNotice = (noticeData: Omit<Notice, 'id' | 'publishedDate'>): Notice => {
    const newNotice: Notice = {
      ...noticeData,
      id: `ntc-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
    logActivity(`Published notice: ${newNotice.title}`, noticeData.postedBy, 'notice');
    addNotification('Hostel Announcement', newNotice.title, 'info', 'notices');
    return newNotice;
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const togglePinNotice = (id: string) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  // Mess
  const updateMessDayMenu = (day: MessDailyMenu['day'], menuUpdates: Partial<MessDailyMenu>) => {
    setMessMenu(prev => prev.map(m => (m.day === day ? { ...m, ...menuUpdates } : m)));
    logActivity(`Updated mess timetable for ${day}`, 'Mess Committee', 'notice');
  };

  const submitMessFeedback = (fbData: Omit<MessFeedback, 'id' | 'date'>) => {
    const newFb: MessFeedback = {
      ...fbData,
      id: `mfb-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setMessFeedbacks(prev => [newFb, ...prev]);
    logActivity(`New mess rating submitted by ${fbData.studentName}`, fbData.studentName, 'notice');
  };

  // Inventory
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'itemCode'>): InventoryItem => {
    const itemCode = `INV-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: InventoryItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      itemCode
    };
    setInventory(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateInventoryStock = (id: string, delta: number, type: 'in' | 'out' | 'damage') => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        let newTotal = item.totalQuantity;
        let newAvail = item.availableQuantity;
        let newDamaged = item.damagedQuantity;

        if (type === 'in') {
          newTotal += delta;
          newAvail += delta;
        } else if (type === 'out') {
          newAvail = Math.max(0, newAvail - delta);
        } else if (type === 'damage') {
          newDamaged += delta;
          newAvail = Math.max(0, newAvail - delta);
        }

        const newStatus: InventoryItem['status'] = newAvail <= 0 ? 'Out of Stock' : newAvail <= item.minThreshold ? 'Low Stock' : 'In Stock';

        return {
          ...item,
          totalQuantity: newTotal,
          availableQuantity: newAvail,
          damagedQuantity: newDamaged,
          status: newStatus
        };
      }
      return item;
    }));
  };

  // Staff
  const addStaff = (staffData: Omit<Staff, 'id' | 'staffId'>): Staff => {
    const staffId = `STF-${String(staff.length + 1).padStart(2, '0')}`;
    const newStaff: Staff = {
      ...staffData,
      id: `stf-${Date.now()}`,
      staffId
    };
    setStaff(prev => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Reset to default
  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setHostels(INITIAL_HOSTELS);
    setFloors(INITIAL_FLOORS);
    setRooms(INITIAL_ROOMS);
    setAdmissions(INITIAL_ADMISSIONS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setComplaints(INITIAL_COMPLAINTS);
    setMaintenance(INITIAL_MAINTENANCE);
    setLeaves(INITIAL_LEAVES);
    setVisitors(INITIAL_VISITORS);
    setNotices(INITIAL_NOTICES);
    setMessMenu(INITIAL_MESS_MENU);
    setMessFeedbacks(INITIAL_MESS_FEEDBACK);
    setInventory(INITIAL_INVENTORY);
    setStaff(INITIAL_STAFF);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
  };

  return (
    <HostelContext.Provider
      value={{
        students,
        hostels,
        floors,
        rooms,
        admissions,
        invoices,
        payments,
        attendance,
        complaints,
        maintenance,
        leaves,
        visitors,
        notices,
        messMenu,
        messFeedbacks,
        inventory,
        staff,
        notifications,
        activityLogs,
        stats,

        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,

        allocateRoom,
        autoAllocateRoom,
        deallocateRoom,
        updateRoom,

        submitAdmission,
        approveAdmission,
        rejectAdmission,
        waitlistAdmission,

        recordPayment,
        createInvoice,

        markAttendance,

        submitComplaint,
        assignComplaint,
        updateComplaintStatus,

        createMaintenanceRequest,
        updateMaintenanceStatus,

        applyLeave,
        approveLeave,
        rejectLeave,

        registerVisitor,
        checkInVisitor,
        checkOutVisitor,

        addNotice,
        deleteNotice,
        togglePinNotice,

        updateMessDayMenu,
        submitMessFeedback,

        addInventoryItem,
        updateInventoryStock,

        addStaff,
        updateStaff,
        deleteStaff,

        markNotificationRead,
        clearNotifications,

        resetToDefaultData
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) throw new Error('useHostel must be used within a HostelProvider');
  return context;
};
