import React, { useState, useEffect } from 'react';
import { Student, Gender } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useToast } from '../common/Toast';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Student | null;
  onSuccess?: (student: Student) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess
}) => {
  const { addStudent, updateStudent, hostels, students } = useHostel();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male' as Gender,
    dob: '2005-01-01',
    email: '',
    phone: '',
    address: '',
    college: 'Apex Institute of Technology',
    department: 'Computer Engineering',
    course: 'B.Tech Computer Engineering',
    year: '1st Year',
    rollNo: '',
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    emergencyContact: '',
    bloodGroup: 'B+',
    medicalNotes: '',
    hostelId: 'h-1',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        gender: initialData.gender,
        dob: initialData.dob,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        college: initialData.college,
        department: initialData.department,
        course: initialData.course,
        year: initialData.year,
        rollNo: initialData.rollNo,
        guardianName: initialData.guardianName,
        guardianRelation: initialData.guardianRelation,
        guardianPhone: initialData.guardianPhone,
        guardianEmail: initialData.guardianEmail,
        emergencyContact: initialData.emergencyContact,
        bloodGroup: initialData.bloodGroup,
        medicalNotes: initialData.medicalNotes || '',
        hostelId: initialData.hostelId || 'h-1',
        photo: initialData.photo
      });
    } else {
      setFormData({
        name: '',
        gender: 'Male',
        dob: '2005-01-01',
        email: '',
        phone: '',
        address: '',
        college: 'Apex Institute of Technology',
        department: 'Computer Engineering',
        course: 'B.Tech Computer Engineering',
        year: '1st Year',
        rollNo: '',
        guardianName: '',
        guardianRelation: 'Father',
        guardianPhone: '',
        guardianEmail: '',
        emergencyContact: '',
        bloodGroup: 'B+',
        medicalNotes: '',
        hostelId: 'h-1',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) errs.phone = 'Valid phone is required';
    if (!formData.rollNo.trim()) errs.rollNo = 'College roll number is required';
    if (!formData.guardianName.trim()) errs.guardianName = 'Guardian name is required';
    if (!formData.guardianPhone.trim()) errs.guardianPhone = 'Guardian phone is required';
    if (!formData.emergencyContact.trim()) errs.emergencyContact = 'Emergency phone is required';

    // Duplicate roll number check
    const existing = students.find(s => s.rollNo.toLowerCase() === formData.rollNo.trim().toLowerCase() && s.id !== initialData?.id);
    if (existing) {
      errs.rollNo = `Roll number already registered to ${existing.name}`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const hostelObj = hostels.find(h => h.id === formData.hostelId);

    if (initialData) {
      updateStudent(initialData.id, {
        ...formData,
        hostelName: hostelObj ? hostelObj.name : initialData.hostelName
      });
      showToast(`Student ${formData.name} updated successfully!`, 'success');
      if (onSuccess) onSuccess({ ...initialData, ...formData });
    } else {
      const studentId = `STU2026${String(students.length + 1).padStart(3, '0')}`;
      const newStu = addStudent({
        ...formData,
        studentId,
        hostelName: hostelObj ? hostelObj.name : 'Hostel',
        floorNo: 0,
        roomNo: '',
        bedNo: '',
        status: 'Active',
        admissionDate: new Date().toISOString().split('T')[0]
      });
      showToast(`Student ${formData.name} enrolled with ID: ${studentId}`, 'success');
      if (onSuccess) onSuccess(newStu);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Student: ${initialData.name}` : 'Enroll New Hostel Resident'}
      subtitle="Complete student registration dossier with academic and emergency records"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Section 1: Personal Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Personal Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kunal Sharma"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.name && <span className="text-rose-500 text-[10px]">{errors.name}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.email && <span className="text-rose-500 text-[10px]">{errors.email}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.phone && <span className="text-rose-500 text-[10px]">{errors.phone}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Permanent Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="House No, Street, City, State, PIN"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Academic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Course *</label>
              <select
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="B.Tech Computer Engineering">B.Tech Computer Engineering</option>
                <option value="B.Tech IT">B.Tech IT</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                <option value="B.Tech Civil">B.Tech Civil</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="BBA">BBA</option>
                <option value="B.Sc Computer Science">B.Sc Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">College Roll Number *</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="e.g. 24CS1090"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.rollNo && <span className="text-rose-500 text-[10px]">{errors.rollNo}</span>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Hostel Block</label>
              <select
                value={formData.hostelId}
                onChange={e => setFormData({ ...formData, hostelId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.code} – {h.name} ({h.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Guardian Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Guardian & Emergency Contacts</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Name *</label>
              <input
                type="text"
                value={formData.guardianName}
                onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Parent name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.guardianName && <span className="text-rose-500 text-[10px]">{errors.guardianName}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
              <select
                value={formData.guardianRelation}
                onChange={e => setFormData({ ...formData, guardianRelation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Local Guardian</option>
                <option value="Sibling">Elder Sibling</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Mobile *</label>
              <input
                type="text"
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                placeholder="+91 98110 00000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.guardianPhone && <span className="text-rose-500 text-[10px]">{errors.guardianPhone}</span>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Contact Phone *</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="24/7 reachable emergency number"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              {errors.emergencyContact && <span className="text-rose-500 text-[10px]">{errors.emergencyContact}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Medical Conditions / Allergies</label>
              <input
                type="text"
                value={formData.medicalNotes}
                onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                placeholder="e.g. Asthma, Penicillin allergy, None"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
          >
            {initialData ? 'Save Changes' : 'Enroll Resident'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
