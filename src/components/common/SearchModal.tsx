import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Home, AlertCircle, Users, Bell, ArrowRight, X } from 'lucide-react';
import { useHostel } from '../../context/HostelContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string, entityId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { students, rooms, complaints, visitors, notices, staff } = useHostel();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  const matchedStudents = cleanQ
    ? students.filter(s =>
        s.name.toLowerCase().includes(cleanQ) ||
        s.studentId.toLowerCase().includes(cleanQ) ||
        s.roomNo.toLowerCase().includes(cleanQ) ||
        s.course.toLowerCase().includes(cleanQ)
      ).slice(0, 4)
    : [];

  const matchedRooms = cleanQ
    ? rooms.filter(r =>
        r.roomNumber.toLowerCase().includes(cleanQ) ||
        r.hostelName.toLowerCase().includes(cleanQ) ||
        r.type.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const matchedComplaints = cleanQ
    ? complaints.filter(c =>
        c.complaintNo.toLowerCase().includes(cleanQ) ||
        c.subject.toLowerCase().includes(cleanQ) ||
        c.location.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const matchedVisitors = cleanQ
    ? visitors.filter(v =>
        v.visitorName.toLowerCase().includes(cleanQ) ||
        v.studentName.toLowerCase().includes(cleanQ) ||
        v.visitorPassNo.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const matchedNotices = cleanQ
    ? notices.filter(n =>
        n.title.toLowerCase().includes(cleanQ) ||
        n.category.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const matchedStaff = cleanQ
    ? staff.filter(s =>
        s.name.toLowerCase().includes(cleanQ) ||
        s.role.toLowerCase().includes(cleanQ) ||
        s.staffId.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const hasResults =
    matchedStudents.length > 0 ||
    matchedRooms.length > 0 ||
    matchedComplaints.length > 0 ||
    matchedVisitors.length > 0 ||
    matchedNotices.length > 0 ||
    matchedStaff.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div
          className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all relative z-10 text-left"
          onClick={e => e.stopPropagation()}
        >
          {/* Input Box */}
          <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 px-4">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search students, rooms, complaints, visitors, notices..."
              className="w-full py-4 text-slate-900 dark:text-white bg-transparent outline-none text-base placeholder-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!cleanQ && (
              <div className="py-6 text-center text-slate-400 text-sm">
                Type a name, roll number, room number (e.g. <span className="font-semibold text-brand-600">A-101</span>), or complaint keyword...
              </div>
            )}

            {cleanQ && !hasResults && (
              <div className="py-8 text-center text-slate-400 text-sm">
                No matching results found for &ldquo;<span className="font-semibold">{query}</span>&rdquo;.
              </div>
            )}

            {/* Students */}
            {matchedStudents.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Students ({matchedStudents.length})
                </h4>
                <div className="space-y-1">
                  {matchedStudents.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        onNavigate('students', s.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {s.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {s.studentId} • Room {s.roomNo || 'Unassigned'} • {s.course}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms */}
            {matchedRooms.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Rooms ({matchedRooms.length})
                </h4>
                <div className="space-y-1">
                  {matchedRooms.map(r => (
                    <div
                      key={r.id}
                      onClick={() => {
                        onNavigate('rooms', r.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Room {r.roomNumber} ({r.type})
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {r.hostelName} • {r.availableBeds} beds available • Status: {r.status}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaints */}
            {matchedComplaints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Complaints ({matchedComplaints.length})
                </h4>
                <div className="space-y-1">
                  {matchedComplaints.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onNavigate('complaints', c.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            #{c.complaintNo} - {c.subject}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {c.location} • Status: {c.status} • By {c.studentName}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff */}
            {matchedStaff.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Staff Members ({matchedStaff.length})
                </h4>
                <div className="space-y-1">
                  {matchedStaff.map(st => (
                    <div
                      key={st.id}
                      onClick={() => {
                        onNavigate('staff', st.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {st.name} ({st.role})
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {st.assignedHostel} • Phone: {st.phone}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notices */}
            {matchedNotices.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Notices ({matchedNotices.length})
                </h4>
                <div className="space-y-1">
                  {matchedNotices.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigate('notices', n.id);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Category: {n.category} • Priority: {n.priority}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
