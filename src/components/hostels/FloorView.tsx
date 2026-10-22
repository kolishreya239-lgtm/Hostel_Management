import React, { useState, useMemo } from 'react';
import {
  Layers, Building, BedDouble, User, CheckCircle2,
  AlertCircle, Wrench, Shield, ArrowRight, Sparkles, Filter
} from 'lucide-react';
import { Room, Student } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, getStatusBadgeClass } from '../../utils/formatters';
import { StudentProfileModal } from '../students/StudentProfileModal';

interface FloorViewProps {
  onOpenAllocateModal: (student?: Student, room?: Room, bedNo?: string) => void;
}

export const FloorView: React.FC<FloorViewProps> = ({ onOpenAllocateModal }) => {
  const { hostels, floors, rooms, students } = useHostel();

  const [selectedHostelId, setSelectedHostelId] = useState<string>(hostels[0]?.id || 'hostel-1');
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number>(0);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const selectedHostel = useMemo(() => {
    return hostels.find(h => h.id === selectedHostelId) || hostels[0];
  }, [hostels, selectedHostelId]);

  // Floors for this hostel
  const hostelFloors = useMemo(() => {
    return floors
      .filter(f => f.hostelId === selectedHostelId)
      .sort((a, b) => a.floorNumber - b.floorNumber);
  }, [floors, selectedHostelId]);

  // If currently selected floor isn't in this hostel's floors, default to first floor
  React.useEffect(() => {
    if (hostelFloors.length > 0 && !hostelFloors.some(f => f.floorNumber === selectedFloorNumber)) {
      setSelectedFloorNumber(hostelFloors[0].floorNumber);
    }
  }, [selectedHostelId, hostelFloors, selectedFloorNumber]);

  // Rooms on selected floor
  const floorRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchHostel = r.hostelId === selectedHostelId;
      const matchFloor = r.floorNumber === selectedFloorNumber;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchHostel && matchFloor && matchStatus;
    });
  }, [rooms, selectedHostelId, selectedFloorNumber, statusFilter]);

  // Aggregated metrics for selected floor
  const allFloorRooms = useMemo(() => {
    return rooms.filter(r => r.hostelId === selectedHostelId && r.floorNumber === selectedFloorNumber);
  }, [rooms, selectedHostelId, selectedFloorNumber]);

  const totalBeds = allFloorRooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = allFloorRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
  const availableBeds = allFloorRooms.reduce((sum, r) => sum + r.availableBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Floor-by-Floor Architectural Blueprint</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive corridor layouts, room allocations, occupancy meters and bed status
          </p>
        </div>

        {/* Hostel Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {hostels.map(h => {
            const isSelected = h.id === selectedHostelId;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHostelId(h.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-brand-300'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>{h.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {h.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Building & Floor Selector Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {selectedHostel?.code}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Warden: {selectedHostel?.wardenName} ({selectedHostel?.wardenContact})
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedHostel?.name} — Floor Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a floor below to inspect the room corridor matrix, occupancy, and bed assignments.
            </p>
          </div>

          {/* Floor KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rooms on Floor</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{allFloorRooms.length}</p>
            </div>
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Beds</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">{totalBeds}</p>
            </div>
            <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Available</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{availableBeds}</p>
            </div>
            <div className="px-4 py-2.5 bg-brand-50 dark:bg-brand-950/30 rounded-2xl border border-brand-100 dark:border-brand-900/40">
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase">Occupancy</span>
              <p className="text-lg font-black text-brand-600 dark:text-brand-400">{occupancyRate}%</p>
            </div>
          </div>
        </div>

        {/* Floor Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {hostelFloors.map(fl => {
            const isActive = fl.floorNumber === selectedFloorNumber;
            const roomsOnFloor = rooms.filter(r => r.hostelId === selectedHostelId && r.floorNumber === fl.floorNumber);
            const occBeds = roomsOnFloor.reduce((sum, r) => sum + r.occupiedBeds, 0);
            const capBeds = roomsOnFloor.reduce((sum, r) => sum + r.capacity, 0);

            return (
              <button
                key={fl.id}
                onClick={() => setSelectedFloorNumber(fl.floorNumber)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <span>{fl.floorName}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {occBeds}/{capBeds} Beds
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Filter Rooms:</span>
            {['ALL', 'AVAILABLE', 'OCCUPIED', 'FULL', 'MAINTENANCE'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span>Vacant Bed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-600"></div>
              <span>Occupied Bed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <span>Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Corridor Visual Grid */}
      {floorRooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Rooms Matching Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your room status filter or select another floor to inspect layout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {floorRooms.map(room => {
            const isFull = room.availableBeds === 0;
            const isMaintenance = room.status === 'Maintenance';

            return (
              <div
                key={room.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  isMaintenance
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10'
                    : isFull
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-emerald-200/80 dark:border-emerald-900/40 ring-1 ring-emerald-500/20'
                }`}
              >
                {/* Room Top Section */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          Room {room.roomNumber}
                        </span>
                        {room.hasAC && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                            AC
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {room.type.toLowerCase()} Occupancy • {formatCurrency(room.monthlyFee)}/mo
                      </p>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadgeClass(room.status)}`}>
                      {room.status}
                    </span>
                  </div>

                  {/* Bed Allocation Layout Visualizer */}
                  <div className="space-y-2 mt-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Beds Layout ({room.occupiedBeds}/{room.capacity} Occupied)
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {room.beds.map(bed => {
                        const resident = bed.isOccupied && bed.studentId
                          ? students.find(s => s.studentId === bed.studentId || s.id === bed.studentId)
                          : null;

                        return (
                          <div
                            key={bed.bedNumber}
                            onClick={() => {
                              if (bed.isOccupied && resident) {
                                setSelectedStudentForProfile(resident);
                              } else if (!bed.isOccupied && !isMaintenance) {
                                onOpenAllocateModal(undefined, room, bed.bedNumber);
                              }
                            }}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                              bed.isOccupied
                                ? 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900/50 hover:border-brand-400'
                                : isMaintenance
                                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 cursor-not-allowed'
                                : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400 hover:bg-emerald-100/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                                Bed {bed.bedNumber}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${bed.isOccupied ? 'bg-brand-600' : isMaintenance ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            </div>

                            {bed.isOccupied && resident ? (
                              <div className="truncate">
                                <p className="text-xs font-bold text-brand-900 dark:text-brand-300 truncate">
                                  {resident.name}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {resident.rollNo}
                                </p>
                              </div>
                            ) : isMaintenance ? (
                              <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                Under Repair
                              </p>
                            ) : (
                              <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400">
                                <span className="text-[10px] font-bold">Vacant</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {room.availableBeds > 0 ? `${room.availableBeds} slot available` : 'Full capacity'}
                  </span>

                  {room.availableBeds > 0 && !isMaintenance ? (
                    <button
                      onClick={() => onOpenAllocateModal(undefined, room)}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center space-x-1"
                    >
                      <span>Allocate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isMaintenance ? (
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                      <Wrench className="w-3 h-3" />
                      <span>In Service</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-slate-400" />
                      <span>Full</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Dossier Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          isOpen={!!selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}
    </div>
  );
};
