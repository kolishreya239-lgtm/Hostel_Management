import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  canAccess: (module: string) => boolean;
  demoUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role access matrix as explicitly defined in prompt specifications:
// ADMIN: Full system access
// WARDEN: Students, Rooms, Attendance, Complaints, Visitors, Leave, Notices
// ACCOUNTANT: Fees, Payments, Receipts, Financial Reports
// STAFF: Assigned Maintenance, Complaints
// STUDENT: Profile, Room, Fees, Attendance, Complaints, Leave, Visitors, Notices, Mess
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'dashboard', 'students', 'admissions', 'hostels', 'rooms', 'allocation',
    'attendance', 'fees', 'complaints', 'maintenance', 'leave', 'visitors',
    'notices', 'mess', 'inventory', 'staff', 'reports', 'settings'
  ],
  warden: [
    'dashboard', 'students', 'hostels', 'rooms', 'attendance', 'complaints',
    'leave', 'visitors', 'notices', 'maintenance', 'reports'
  ],
  student: [
    'dashboard', 'profile', 'my-room', 'fees', 'attendance', 'complaints',
    'leave', 'visitors', 'notices', 'mess'
  ],
  accountant: [
    'dashboard', 'fees', 'reports', 'students'
  ],
  staff: [
    'dashboard', 'maintenance', 'complaints'
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hostelhub_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    // Default to admin for immediate presentation readiness
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hostelhub_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hostelhub_user');
    }
  }, [currentUser]);

  const currentRole: UserRole = currentUser ? currentUser.role : 'admin';

  const login = (email: string, role?: UserRole): boolean => {
    const user = INITIAL_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() || (role && u.role === role)
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // If not found in demo, create a session user with selected role
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: role || 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const canAccess = (module: string): boolean => {
    if (!currentUser) return false;
    const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
    return allowed.includes(module);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        login,
        logout,
        switchDemoRole,
        canAccess,
        demoUsers: INITIAL_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
