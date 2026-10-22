import React, { useState } from 'react';
import { Building, MapPin, Phone, User, BedDouble, ArrowRight, Search } from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency } from '../../utils/formatters';

interface HostelListProps {
  onSelectHostel: (hostelId: string) => void;
  onNavigateToRooms: () => void;
}

export const HostelList: React.FC<HostelListProps> = ({
  onSelectHostel,
  onNavigateToRooms
}) => {
  const { hostels, rooms } = useHostel();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Boys' | 'Girls'>('All');

  const filteredHostels = hostels.filter(hostel => {
    const matchesType = typeFilter === 'All' || hostel.type === typeFilter;
    const searchText = `${hostel.name} ${hostel.code} ${hostel.address} ${hostel.wardenName}`.toLowerCase();
    return matchesType && searchText.includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hostel Blocks & Buildings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overview of campus residences, wardens, floor distribution, and live occupancy rates
          </p>
        </div>

        <button
          onClick={onNavigateToRooms}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
        >
          <BedDouble className="w-4 h-4" />
          <span>View All Rooms & Beds Matrix</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Filter hostel blocks by residence type">
          {(['All', 'Boys', 'Girls'] as const).map(type => (
            <button
              key={type}
              type="button"
              aria-pressed={typeFilter === type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                typeFilter === type
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {type === 'All' ? 'All blocks' : `${type} residence`}
            </button>
          ))}
        </div>

        <label className="relative flex min-w-0 items-center sm:w-72">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder="Search blocks, location, warden..."
            aria-label="Search hostel blocks"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <p className="shrink-0 text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          {filteredHostels.length} of {hostels.length} blocks
        </p>
      </div>

      {/* Hostels Cards Grid */}
      {filteredHostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHostels.map(hostel => {
          const hostelRooms = rooms.filter(r => r.hostelId === hostel.id);
          const totalOccupied = hostelRooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
          const totalCapacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
          const availableBeds = Math.max(0, totalCapacity - totalOccupied);
          const occupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

          return (
            <div
              key={hostel.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
            >
              {/* Image & Header */}
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 shadow-sm backdrop-blur-md">
                      {hostel.code}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                      hostel.type === 'Boys' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                    }`}>
                      {hostel.type} Residence
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight">
                      {hostel.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {hostel.address}
                    </p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-5">
                  {/* Occupancy Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        Live Bed Occupancy
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {totalOccupied} / {totalCapacity} Beds ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occupancyPct >= 90
                            ? 'bg-rose-500'
                            : occupancyPct >= 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Quick Stat Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">Floors</span>
                      <span className="font-bold text-base text-slate-900 dark:text-white">{hostel.totalFloors} Levels</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                      <span className="text-slate-400 block text-[11px]">Total Rooms</span>
                      <span className="font-bold text-base text-slate-900 dark:text-white">{hostelRooms.length} Rooms</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center text-emerald-800 dark:text-emerald-300">
                      <span className="block text-[11px]">Vacant Beds</span>
                      <span className="font-bold text-base">{availableBeds} Free</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-center text-blue-800 dark:text-blue-300">
                      <span className="block text-[11px]">Building</span>
                      <span className="font-bold text-base truncate">{hostel.building}</span>
                    </div>
                  </div>

                  {/* Warden Contact Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-600 flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {hostel.wardenName}
                        </p>
                        <p className="text-[11px] text-slate-400">Resident Warden</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${hostel.wardenContact}`}
                      className="flex items-center space-x-1 text-brand-600 dark:text-brand-400 font-bold hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{hostel.wardenContact}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">
                  Hostel ID: <strong className="text-slate-700 dark:text-slate-300">{hostel.id}</strong>
                </span>

                <button
                  onClick={() => {
                    onSelectHostel(hostel.id);
                    onNavigateToRooms();
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 font-bold text-xs shadow-sm hover:border-brand-300 transition-colors flex items-center space-x-1.5"
                >
                  <span>Explore Rooms & Beds</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700" role="status">
          <p className="font-semibold text-slate-800 dark:text-slate-200">No hostel blocks match your search.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('All');
            }}
            className="mt-3 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
