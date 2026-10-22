import React, { useState } from 'react';
import { Gender, RoomType, AdmissionApplication } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useToast } from '../common/Toast';
import { Upload, CheckCircle2 } from 'lucide-react';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (app: AdmissionApplication) => void;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { submitAdmission, hostels } = useHostel();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male' as Gender,
    dob: '2006-01-01',
    mobile: '',
    email: '',
    address: '',
    college: 'Apex Institute of Technology',
    course: 'B.Tech Computer Engineering',
    department: 'Computer Engineering',
    year: '1st Year',
    rollNumber: '',
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    emergencyContact: '',
    bloodGroup: 'B+',
    medicalNotes: '',
    preferredHostelId: 'h-1',
    preferredRoomType: 'Double Sharing' as RoomType,
    preferredAC: true
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    aadhaar: false,
    collegeId: false,
    photo: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.mobile || !formData.rollNumber) {
      showToast('Please fill all mandatory fields.', 'danger');
      return;
    }

    const created = submitAdmission(formData);
    showToast(`Admission application #${created.applicationNo} registered!`, 'success');
    if (onSuccess) onSuccess(created);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hostel Admission Application Form"
      subtitle="Submit official application for on-campus student residence allotment"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Personal Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Personal Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Applicant name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile *</label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="applicant@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, City, State, PIN"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. Academic Program</h4>
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
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="BBA">BBA</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll / Application # *</label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 24CS1109"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Year of Study</label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accommodation Preferences */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Hostel Preferences</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Block</label>
              <select
                value={formData.preferredHostelId}
                onChange={e => setFormData({ ...formData, preferredHostelId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>{h.code} – {h.name} ({h.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Room Type</label>
              <select
                value={formData.preferredRoomType}
                onChange={e => setFormData({ ...formData, preferredRoomType: e.target.value as RoomType })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Single">Single Room</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Four Sharing">Four Sharing</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Air Conditioning</label>
              <select
                value={formData.preferredAC ? 'yes' : 'no'}
                onChange={e => setFormData({ ...formData, preferredAC: e.target.value === 'yes' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="yes">AC Room</option>
                <option value="no">Non-AC Room</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mock Document Uploads */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">4. Document Proofs (KYC)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setUploadedDocs({ ...uploadedDocs, aadhaar: !uploadedDocs.aadhaar })}
              className={`p-3 rounded-xl border text-center transition-all ${
                uploadedDocs.aadhaar
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Upload className="w-4 h-4 mx-auto mb-1" />
              <span>{uploadedDocs.aadhaar ? '✓ Aadhaar Uploaded' : 'Upload Aadhaar Card'}</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadedDocs({ ...uploadedDocs, collegeId: !uploadedDocs.collegeId })}
              className={`p-3 rounded-xl border text-center transition-all ${
                uploadedDocs.collegeId
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Upload className="w-4 h-4 mx-auto mb-1" />
              <span>{uploadedDocs.collegeId ? '✓ College ID Uploaded' : 'Upload College ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => setUploadedDocs({ ...uploadedDocs, photo: !uploadedDocs.photo })}
              className={`p-3 rounded-xl border text-center transition-all ${
                uploadedDocs.photo
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'border-dashed border-slate-300 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Upload className="w-4 h-4 mx-auto mb-1" />
              <span>{uploadedDocs.photo ? '✓ Passport Photo Uploaded' : 'Upload Passport Photo'}</span>
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
          >
            Submit Application
          </button>
        </div>
      </form>
    </Modal>
  );
};
