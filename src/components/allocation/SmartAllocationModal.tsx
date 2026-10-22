import React, { useState, useEffect } from 'react';
import { Student, Room, RoomType, Bed } from '../../types';
import { Modal } from '../common/Modal';
import { useHostel } from '../../context/HostelContext';
import { useToast } from '../common/Toast';
import { BedDouble, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface SmartAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudent?: Student | null;
  preselectedRoom?: Room | null;
  preselectedBed?: string;
}

export const SmartAllocationModal: React.FC<SmartAllocationModalProps> = ({
  isOpen,
  onClose,
  preselectedStudent,
  preselectedRoom,
  preselectedBed
}) => {
  const { students, hostels, rooms, allocateRoom, autoAllocateRoom } = useHostel();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedHostelId, setSelectedHostelId] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoomNo, setSelectedRoomNo] = useState<string>('');
  const [selectedBedNo, setSelectedBedNo] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Auto Allocate preferences
  const [prefType, setPrefType] = useState<RoomType>('Double Sharing');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (preselectedStudent) {
      setSelectedStudentId(preselectedStudent.id);
      if (preselectedStudent.hostelId) setSelectedHostelId(preselectedStudent.hostelId);
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].id);
    }

    if (preselectedRoom) {
      setSelectedHostelId(preselectedRoom.hostelId);
      setSelectedFloor(preselectedRoom.floorNumber);
      setSelectedRoomNo(preselectedRoom.roomNumber);
    } else if (hostels.length > 0) {
      setSelectedHostelId(hostels[0].id);
    }

    if (preselectedBed) {
      setSelectedBedNo(preselectedBed);
    }

    setErrorMsg('');
  }, [preselectedStudent, preselectedRoom, preselectedBed, isOpen, students, hostels]);

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Filter rooms by hostel and floor
  const candidateRooms = rooms.filter(
    r => r.hostelId === selectedHostelId && r.floorNumber === Number(selectedFloor)
  );

  // Set default room if none selected
  useEffect(() => {
    if (candidateRooms.length > 0 && !candidateRooms.some(r => r.roomNumber === selectedRoomNo)) {
      setSelectedRoomNo(candidateRooms[0].roomNumber);
    }
  }, [selectedHostelId, selectedFloor, candidateRooms, selectedRoomNo]);

  const currentRoom = candidateRooms.find(r => r.roomNumber === selectedRoomNo);

  // Available beds in current room
  const availableBeds = currentRoom ? currentRoom.beds.filter(b => !b.isOccupied) : [];

  useEffect(() => {
    if (currentRoom) {
      if (availableBeds.length > 0 && !availableBeds.some(b => b.bedNumber === selectedBedNo)) {
        setSelectedBedNo(availableBeds[0].bedNumber);
      }
    }
  }, [currentRoom, availableBeds, selectedBedNo]);

  if (!isOpen) return null;

  const handleManualAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedStudentId) {
      setErrorMsg('Please select a student.');
      return;
    }
    if (!selectedRoomNo) {
      setErrorMsg('Please select a valid room.');
      return;
    }
    if (!selectedBedNo) {
      setErrorMsg('Please select an available bed in this room.');
      return;
    }

    const result = allocateRoom(
      selectedStudentId,
      selectedHostelId,
      Number(selectedFloor),
      selectedRoomNo,
      selectedBedNo,
      checkInDate
    );

    if (result.success) {
      showToast(result.message, 'success');
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleAutoAllocate = () => {
    setErrorMsg('');
    if (!selectedStudentId) {
      setErrorMsg('Please select a student.');
      return;
    }

    const result = autoAllocateRoom(selectedStudentId, selectedHostelId || undefined, prefType);
    if (result.success) {
      showToast(result.message, 'success');
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Room & Bed Allocation Engine"
      subtitle="Assign students to verified vacant rooms with automatic capacity and gender verification"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'manual'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
            }`}
          >
            Manual Room & Bed Selection
          </button>
          <button
            type="button"
            onClick={() => setMode('auto')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'auto'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Smart Auto-Allocate</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Student Selection */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="block font-bold text-slate-700 dark:text-slate-300">
            Select Student for Allocation *
          </label>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.studentId}) – {s.gender} • Currently in: {s.roomNo ? `Room ${s.roomNo} (${s.bedNo})` : 'Unallocated'}
              </option>
            ))}
          </select>

          {currentStudent && (
            <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 pt-1 text-[11px]">
              <span>Gender: <strong className="text-slate-800 dark:text-white">{currentStudent.gender}</strong></span>
              <span>•</span>
              <span>Course: <strong className="text-slate-800 dark:text-white">{currentStudent.course}</strong></span>
              <span>•</span>
              <span>Roll: <strong className="text-slate-800 dark:text-white">{currentStudent.rollNo}</strong></span>
            </div>
          )}
        </div>

        {/* Manual Allocation Mode */}
        {mode === 'manual' ? (
          <form onSubmit={handleManualAllocate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hostel */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hostel Block *
                </label>
                <select
                  value={selectedHostelId}
                  onChange={e => setSelectedHostelId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.code} – {h.name} ({h.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Floor Level *
                </label>
                <select
                  value={selectedFloor}
                  onChange={e => setSelectedFloor(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value={1}>Floor 1 (Ground Floor)</option>
                  <option value={2}>Floor 2 (First Floor)</option>
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Room *
                </label>
                <select
                  value={selectedRoomNo}
                  onChange={e => setSelectedRoomNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  {candidateRooms.map(r => (
                    <option
                      key={r.id}
                      value={r.roomNumber}
                      disabled={r.availableBeds === 0 && !r.beds.some(b => b.studentId === currentStudent?.studentId)}
                    >
                      Room {r.roomNumber} ({r.type}) – {r.availableBeds} beds available {r.availableBeds === 0 ? '(FULL)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bed */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bed Slot in Room *
                </label>
                <select
                  value={selectedBedNo}
                  onChange={e => setSelectedBedNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  {currentRoom?.beds.map((b, i) => (
                    <option
                      key={i}
                      value={b.bedNumber}
                      disabled={b.isOccupied && b.studentId !== currentStudent?.studentId}
                    >
                      {b.bedNumber} – {b.isOccupied ? `Occupied by ${b.studentName || 'Student'}` : 'VACANT'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check in date */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Effective Check-In / Allocation Date *
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={e => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Room Visual Preview */}
            {currentRoom && (
              <div className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-brand-900 dark:text-brand-200">
                    Room {currentRoom.roomNumber} ({currentRoom.type})
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
                    {currentRoom.occupiedBeds}/{currentRoom.capacity} Beds Occupied
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentRoom.beds.map((b, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border text-center ${
                        b.bedNumber === selectedBedNo
                          ? 'border-brand-500 bg-brand-500 text-white font-bold'
                          : b.isOccupied
                          ? 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40'
                      }`}
                    >
                      <p className="font-bold text-[11px]">{b.bedNumber}</p>
                      <p className="text-[10px] truncate">{b.isOccupied ? b.studentName || 'Occupied' : 'Vacant'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                Allocate Room
              </button>
            </div>
          </form>
        ) : (
          /* Auto Allocate Mode */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
              <p className="font-bold mb-1">How Auto-Allocation Works:</p>
              <p>
                Our recommendation engine checks the student&rsquo;s gender ({currentStudent?.gender || 'N/A'}), locates hostels matching their residency category (Boys / Girls), inspects live room vacancies, and automatically selects an optimal room matching room-type preference without risk of overbooking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Room Type
                </label>
                <select
                  value={prefType}
                  onChange={e => setPrefType(e.target.value as RoomType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="Single">Single Room</option>
                  <option value="Double Sharing">Double Sharing</option>
                  <option value="Triple Sharing">Triple Sharing</option>
                  <option value="Four Sharing">Four Sharing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hostel Block Preference
                </label>
                <select
                  value={selectedHostelId}
                  onChange={e => setSelectedHostelId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="">Any Available Matching Hostel</option>
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.code} – {h.name} ({h.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAutoAllocate}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/25 flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run Auto-Allocate Algorithm</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
