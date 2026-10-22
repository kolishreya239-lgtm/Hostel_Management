export type UserRole = 'admin' | 'warden' | 'student' | 'accountant' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  studentId?: string; // If role is student
  hostelId?: string;  // If warden or student
}

export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  studentId: string; // e.g. "STU2026001"
  name: string;
  photo: string;
  gender: Gender;
  dob: string;
  email: string;
  phone: string;
  address: string;
  college: string;
  department: string;
  course: string;
  year: string; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  rollNo: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  bloodGroup: string;
  medicalNotes?: string;
  hostelId: string;
  hostelName: string;
  floorNo: number;
  roomNo: string;
  bedNo: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Alumni';
  admissionDate: string;
  expectedCheckoutDate?: string;
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  type: 'Boys' | 'Girls' | 'Co-ed';
  building: string;
  address: string;
  wardenName: string;
  wardenContact: string;
  totalFloors: number;
  totalRooms: number;
  totalBeds: number;
  image: string;
}

export interface Floor {
  id: string;
  hostelId: string;
  floorNumber: number;
  floorName: string;
  totalRooms: number;
}

export type RoomType = 'Single' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing';
export type RoomStatus = 'Available' | 'Partially Occupied' | 'Full' | 'Maintenance' | 'Reserved';

export interface Bed {
  bedNumber: string; // "Bed 1", "Bed 2", etc.
  isOccupied: boolean;
  studentId?: string;
  studentName?: string;
  checkInDate?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  hostelId: string;
  hostelName: string;
  floorNumber: number;
  type: RoomType;
  capacity: number;
  occupiedBeds: number;
  availableBeds: number;
  monthlyFee: number;
  status: RoomStatus;
  hasAC: boolean;
  beds: Bed[];
}

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  fullName: string;
  gender: Gender;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  college: string;
  course: string;
  department: string;
  year: string;
  rollNumber: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  bloodGroup: string;
  medicalNotes?: string;
  preferredHostelId: string;
  preferredRoomType: RoomType;
  preferredAC: boolean;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';
  appliedDate: string;
  reviewedDate?: string;
  reviewRemarks?: string;
  allocatedRoomNo?: string;
  allocatedBedNo?: string;
}

export type FeeCategory = 'Hostel Fee' | 'Security Deposit' | 'Mess Fee' | 'Maintenance Fee' | 'Other Charges';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue';
export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  category: FeeCategory;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: PaymentStatus;
  academicTerm: string; // e.g. "Spring 2026"
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNo: string;
  invoiceId?: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  category: FeeCategory;
  receivedBy: string;
  notes?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  hostelId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;
  remarks?: string;
}

export type ComplaintCategory = 'Electrical' | 'Plumbing' | 'Internet' | 'Cleaning' | 'Room' | 'Food/Mess' | 'Security' | 'Other';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  complaintNo: string;
  studentId: string;
  studentName: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  location: string; // e.g. "Room A-204" or "Floor 2 Washroom"
  priority: PriorityLevel;
  status: ComplaintStatus;
  createdAt: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface MaintenanceRequest {
  id: string;
  requestNo: string;
  roomNo: string;
  hostelName: string;
  studentName: string;
  issue: string;
  priority: PriorityLevel;
  assignedStaffName: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Urgent';
  createdDate: string;
  completedDate?: string;
  cost?: number;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  requestNo: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  hostelName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  destination: string;
  parentContact: string;
  emergencyContact: string;
  status: LeaveStatus;
  appliedDate: string;
  actionDate?: string;
  actionRemarks?: string;
  approvedBy?: string;
}

export type VisitorStatus = 'Expected' | 'Checked In' | 'Checked Out' | 'Cancelled';

export interface Visitor {
  id: string;
  visitorPassNo: string;
  visitorName: string;
  studentId: string;
  studentName: string;
  roomNo: string;
  relationship: string;
  phone: string;
  idProof: string; // e.g. "Aadhaar XXXX-8912"
  visitDate: string;
  entryTime: string;
  exitTime?: string;
  purpose: string;
  status: VisitorStatus;
}

export type NoticeCategory = 'General' | 'Academic' | 'Hostel' | 'Mess' | 'Emergency' | 'Event';
export type NoticeAudience = 'All Students' | 'Boys Hostel' | 'Girls Hostel' | 'Staff Only' | 'Wardens';

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  priority: PriorityLevel;
  audience: NoticeAudience;
  publishedDate: string;
  postedBy: string;
  isPinned: boolean;
}

export interface MessDailyMenu {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface MessFeedback {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  foodRating: number; // 1 to 5
  tasteRating: number;
  qualityRating: number;
  cleanlinessRating: number;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  comment: string;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'Furniture' | 'Electrical' | 'Bedding' | 'Cleaning' | 'Electronics' | 'Kitchen';
  totalQuantity: number;
  availableQuantity: number;
  damagedQuantity: number;
  location: string;
  purchaseDate: string;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  minThreshold: number;
}

export type StaffRole = 'Warden' | 'Security' | 'Cleaner' | 'Electrician' | 'Plumber' | 'Cook' | 'Maintenance Staff';

export interface Staff {
  id: string;
  staffId: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  joiningDate: string;
  assignedHostel: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Full-day';
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
  targetRole?: UserRole;
  targetStudentId?: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  type: 'admission' | 'allocation' | 'fee' | 'complaint' | 'leave' | 'visitor' | 'notice' | 'maintenance';
}
