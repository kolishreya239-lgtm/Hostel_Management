import React, { useState } from 'react';
import {
  Building2, BedDouble, Users, CreditCard, AlertTriangle,
  CalendarCheck, UserCheck, Send, FileBarChart2, ShieldCheck,
  ChevronRight, ArrowRight, Sparkles, CheckCircle2, Phone,
  Mail, MapPin, Star, Building, Laptop, Award, Clock
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../common/Toast';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const { currentUser, switchDemoRole } = useAuth();
  const { hostels, stats } = useHostel();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    institution: '',
    message: ''
  });

  const handleOpenAuth = (role: UserRole = 'admin') => {
    setSelectedRole(role);
    setIsAuthOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Thank you! Your institutional inquiry has been sent to our campus outreach team.', 'success');
    setContactForm({ name: '', email: '', institution: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* 1. Public Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Hostel<span className="text-brand-600">Hub</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Smart Management. Better Living.
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
            <a href="#hostels" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Residences</a>
            <a href="#stats" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Performance</a>
            <a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleOpenAuth('admin')}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                if (currentUser) {
                  onEnterDashboard();
                } else {
                  handleOpenAuth('admin');
                }
              }}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-md shadow-brand-500/25 transition-all flex items-center space-x-1.5"
            >
              <span>{currentUser ? 'Launch Portal' : 'Live Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Enterprise-Grade Campus Accommodation Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Smart Hostel Management <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Made Simple & Transparent
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Manage student admissions, bed allocation, fee collection, complaints, biometric attendance, and campus visitors from one unified, cloud-native platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleOpenAuth('admin')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-base shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started – Live Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850 font-semibold text-base shadow-sm transition-all"
            >
              Explore All Features
            </a>
          </div>

          {/* Quick Role Test Bar */}
          <div className="mt-10 p-3 max-w-xl mx-auto rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Launch directly as:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(['admin', 'warden', 'student', 'accountant', 'staff'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    switchDemoRole(role);
                    onEnterDashboard();
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-bold capitalize bg-slate-100 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/60 text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {role} &rarr;
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Preview Graphic */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:p-4 shadow-2xl overflow-hidden">
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-900 text-left">
              {/* Fake top bar */}
              <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/60">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 ml-4 font-mono">hostelhub.campus.edu/portal</span>
              </div>
              {/* Dashboard Preview Snippet */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/50">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Total Enrolled</p>
                  <p className="text-2xl font-bold text-white mt-1">1,250+ Students</p>
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium">98.4% verified roster</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Live Occupancy</p>
                  <p className="text-2xl font-bold text-teal-400 mt-1">96% Occupied</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">520 Rooms across 4 Blocks</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Fee Realization</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">₹2.4 Cr Managed</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">Instant UPI & Netbanking</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Maintenance SLA</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">&lt; 4.2 Hours</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">Avg issue turnaround</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section id="stats" className="py-14 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Verified Operational Metrics (Demo Data)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">1,250+</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Active Resident Scholars</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">520</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Furnished Rooms</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">96%</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Average Occupancy</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">₹2.4 Cr</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Annual Fees Managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Everything Your Hostel Needs in One System
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Eliminate paper registers, spreadsheet errors, and manual confusion with an automated digital workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Smart Room Allocation
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Visual bed assignment matrix with automatic capacity checks, gender constraints, and 1-click Auto-Allocate algorithms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Digital Admissions
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Paperless student application portal with guardian KYC, blood group records, document upload, and admission approvals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Fee & Payment Tracker
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Automatic invoice billing, UPI/Cash/Card ledger, overdue tracking, and official printable digital fee receipts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Complaint Resolution
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Categorized ticketing for electrical, plumbing, WiFi, and mess issues with real-time staff dispatching and status tracking.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Daily Attendance
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Rapid roll-call marking for Present, Absent, Late, or On-Leave status with monthly percentage calculations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Visitor Management
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Digital visitor entry register, ID verification, time-stamped Check-In/Check-Out, and printable visitor passes.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Leave & Out-Pass
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Online outstation leave applications, warden parent confirmation check, and barcode-ready digital Gate Out-Passes.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <FileBarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Reports & Analytics
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                12 comprehensive audit reports, CSV downloads, occupancy heatmaps, and financial statements ready for university review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Hostel Residences Showcase */}
      <section id="hostels" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Campus Facilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Modern Residential Blocks
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              State-of-the-art living facilities equipped with high-speed fiber internet, RO drinking water, 24/7 CCTV, and healthy dining halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostels.map(hostel => (
              <div
                key={hostel.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-850 hover:shadow-lg transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                    {hostel.code}
                  </div>
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                    hostel.type === 'Boys' ? 'bg-blue-600/90 text-white' : 'bg-pink-600/90 text-white'
                  }`}>
                    {hostel.type}
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {hostel.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {hostel.address}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Floors:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{hostel.totalFloors} Levels</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Rooms:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{hostel.totalRooms} Rooms</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Warden:</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{hostel.wardenName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Capacity:</span>{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{hostel.totalBeds} Beds</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. About Section */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                About HostelHub
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                Built to Revolutionize Student Residence Governance
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                HostelHub was engineered specifically to solve the chaotic operational challenges faced by university hostels, residential colleges, and private student dormitories.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Strict Role Separation</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Independent viewports for Wardens, Students, Accountants, and Maintenance Technicians with airtight permission limits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Double-Booking Guarantee</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Smart bed-level locking algorithms permanently prevent allocating a student to full rooms or already-occupied beds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Audit & University Compliance</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Automated generation of digital fee receipts, attendance summaries, and gate pass logs ready for regulatory inspection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/60 text-brand-600 rounded-2xl">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Institutional Reliability</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Trusted across 25+ major universities</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">Instant Deployment</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Runs seamlessly on modern web browsers with instant local/cloud synchronization.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">Clean UI & Accessible UX</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">Designed with high-contrast accessibility, dark mode, and mobile responsive menus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Campus Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                Get in Touch with Our Administration Team
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Interested in bringing HostelHub to your educational institution? Contact our central administrative helpdesk or drop a message.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Official Email</p>
                    <p className="font-semibold">admin@hostelhub.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Campus Helpline</p>
                    <p className="font-semibold">+91 98765 43210 / (011) 2659-8800</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Central Secretariat</p>
                    <p className="font-semibold">Tech Enclave Campus, Hauz Khas, New Delhi - 110016</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Send an Administrative Message
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Prof. / Mr. / Ms."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@university.edu"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Institution / College
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.institution}
                      onChange={e => setContactForm({ ...contactForm, institution: e.target.value })}
                      placeholder="e.g. Apex Tech Institute"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your campus capacity, requirements, or presentation inquiry..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Professional Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-white">HostelHub</span>
              </div>
              <p className="text-xs text-slate-400">
                “Smart Management. Better Living.”
              </p>
              <p className="text-xs text-slate-400">
                The unified accommodation operating system for colleges, universities, and student residences.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#hostels" className="hover:text-white transition-colors">Hostel Blocks</a></li>
                <li><a href="#stats" className="hover:text-white transition-colors">Occupancy Stats</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About System</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                User Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handleOpenAuth('admin')} className="hover:text-white transition-colors">Admin Dashboard</button></li>
                <li><button onClick={() => handleOpenAuth('warden')} className="hover:text-white transition-colors">Warden Roster</button></li>
                <li><button onClick={() => handleOpenAuth('student')} className="hover:text-white transition-colors">Student Resident Portal</button></li>
                <li><button onClick={() => handleOpenAuth('accountant')} className="hover:text-white transition-colors">Accounts & Fees</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Contact & Support
              </h4>
              <p className="text-xs text-slate-400 mb-2">Campus Security Control Room: 24/7 Helpline</p>
              <p className="text-xs font-semibold text-white">helpdesk@hostelhub.edu</p>
              <p className="text-xs text-slate-400 mt-1">+91 98765 43210</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2026 HostelHub – Smart Hostel Management System. “Designed for modern educational institutions.”</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Security Center</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={selectedRole}
        onSuccess={onEnterDashboard}
      />
    </div>
  );
};
