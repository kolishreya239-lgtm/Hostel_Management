import React, { useState, useMemo } from 'react';
import {
  BedDouble, Search, Filter, Plus, User, CheckCircle2,
  AlertCircle, Wrench, Shield, Sparkles, Home, ChevronRight
} from 'lucide-react';
import { Room, RoomType, RoomStatus, Student } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, getStatusBadgeClass } from '../../utils/formatters';
import { SmartAllocationModal } from '../allocation/SmartAllocationModal';
import { StudentProfileModal } from '../students/StudentProfileModal';

interface RoomGridProps {
  initialHostelFilter?: string;
  onOpenAllocateModal: (student?: Student, room?: Room, bedNo?: string) => void;
}

export const RoomGrid: React.FC<RoomGridProps> = ({
  initialHostelFilter = '',
  onOpenAllocateModal
}) => {
  const { rooms, hostels, students, deallocateRoom } = useHostel();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [hostelFilter, setHostelFilter] = useState(initialHostelFilter);
  const [floorFilter, setFloorFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Selected student for dossier popup
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  // Filter logic
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || r.roomNumber.toLowerCase().includes(q) || r.hostelName.toLowerCase().includes(q);
      const matchesHostel = !hostelFilter || r.hostelId === hostelFilter;
      const matchesFloor = !floorFilter || r.floorNumber === Number(floorFilter);
      const matchesType = !typeFilter || r.type === typeFilter;
      const matchesStatus = !statusFilter || r.status === statusFilter;

      return matchesSearch && matchesHostel && matchesFloor && matchesType && matchesStatus;
    });
  }, [rooms, searchQuery, hostelFilter, floorFilter, typeFilter, statusFilter]);

  // Aggregate stats
  const totalBeds = filteredRooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = filteredRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
  const availableBeds = filteredRooms.reduce((sum, r) => sum + r.availableBeds, 0);

  const handleBedClick = (room: Room, bedNumber: string, isOccupied: boolean, studentId?: string) => {
    if (isOccupied && studentId) {
      const stu = students.find(s => s.studentId === studentId || s.id === studentId);
      if (stu) {
        setSelectedStudentForProfile(stu);
      }
    } else {
      // Trigger allocation for this specific bed
      onOpenAllocateModal(undefined, room, bedNumber);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Rooms & Visual Bed Allocation Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive room cards with bed-by-bed status tracking, capacity limits, and instant occupant inspection
          </p>
        </div>

        <button
          onClick={() => onOpenAllocateModal()}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Allocate / Auto-Allocate Bed</span>
        </button>
      </div>

      {/* Aggregate Counts Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-slate-400 block font-medium">Filtered Rooms</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">{filteredRooms.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-slate-400 block font-medium">Total Capacity</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">{totalBeds} Beds</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-emerald-600 dark:text-emerald-400 block font-medium">Available Vacancies</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{availableBeds} Vacant</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-blue-600 dark:text-blue-400 block font-medium">Occupied Beds</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{occupiedBeds} Taken</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Room (e.g. A-101)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Hostel */}
          <select
            value={hostelFilter}
            onChange={e => setHostelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Hostels</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.code} – {h.name}</option>
            ))}
          </select>

          {/* Floor */}
          <select
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Floors</option>
            <option value="1">Floor 1 (Ground)</option>
            <option value="2">Floor 2 (First Floor)</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Room Types</option>
            <option value="Single">Single Room</option>
            <option value="Double Sharing">Double Sharing</option>
            <option value="Triple Sharing">Triple Sharing</option>
            <option value="Four Sharing">Four Sharing</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Room Statuses</option>
            <option value="Available">Available</option>
            <option value="Partially Occupied">Partially Occupied</option>
            <option value="Full">Full</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        {/* Reset button if filtered */}
        {(searchQuery || hostelFilter || floorFilter || typeFilter || statusFilter) && (
          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">
              Active filters applied
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setHostelFilter('');
                setFloorFilter('');
                setTypeFilter('');
                setStatusFilter('');
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Visual Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => {
          const isFull = room.availableBeds === 0;

          return (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              {/* Room Card Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        Room {room.roomNumber}
                      </h3>
                      {room.hasAC ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                          AC
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          Non-AC
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {room.hostelName} • Floor {room.floorNumber}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${getStatusBadgeClass(room.status)}`}>
                    {room.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-500">
                      Capacity: <strong className="text-slate-800 dark:text-slate-200">{room.capacity}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">
                      {room.availableBeds} Available
                    </span>
                  </div>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">
                    {formatCurrency(room.monthlyFee)}/mo
                  </span>
                </div>
              </div>

              {/* Individual Bed Management Section (Section 16) */}
              <div className="p-5 space-y-2.5 flex-1 bg-slate-50/50 dark:bg-slate-950/30">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Bed Allocation Slots:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {room.beds.map((bed, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleBedClick(room, bed.bedNumber, bed.isOccupied, bed.studentId)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        bed.isOccupied
                          ? 'border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 dark:border-blue-900/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200'
                          : 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 dark:border-emerald-900/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold">{bed.bedNumber}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          bed.isOccupied ? 'bg-blue-200/80 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
                        }`}>
                          {bed.isOccupied ? 'Occupied' : 'Vacant'}
                        </span>
                      </div>

                      {bed.isOccupied ? (
                        <div>
                          <p className="font-bold text-xs truncate">
                            {bed.studentName}
                          </p>
                          <p className="text-[10px] text-blue-600/80 dark:text-blue-300 font-mono">
                            {bed.studentId}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center">
                          <Plus className="w-3 h-3 mr-1" /> Click to Allocate
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">
                  {room.type}
                </span>

                {!isFull && room.status !== 'Maintenance' ? (
                  <button
                    onClick={() => onOpenAllocateModal(undefined, room)}
                    className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center"
                  >
                    <span>Allocate Student</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                ) : (
                  <span className="text-slate-400 font-bold">
                    {room.status === 'Maintenance' ? 'Under Repair' : 'Full Capacity'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dossier Modal when clicking on occupant */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
      />
    </div>
  );
};
