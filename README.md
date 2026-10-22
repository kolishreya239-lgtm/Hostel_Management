# 🏢 HostelHub – Smart Hostel Management System
> **“Smart Management. Better Living.”**  
> A complete, enterprise-grade, modern web-based Hostel Management platform engineered for colleges, universities, and private student residential complexes.

---

## 🌟 Overview & Key Highlights

**HostelHub** is a production-quality SaaS web application developed with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**. It replaces outdated paper-based and disjointed spreadsheet systems with a centralized, unified campus portal supporting multi-role access control, reactive state management, digital receipt generation, smart bed allocation algorithms, and extensive audit reporting.

### 🎯 Key System Capabilities
1. **Public Admissions & Campus Portal**:
   - Modern marketing showcase, campus statistics, block highlights, digital room tours, interactive pricing calculator, online admission applications, and FAQs.
2. **Role-Based Access Control (RBAC)**:
   - 5 realistic personas (**Super Admin / Chief Warden**, **Residential Warden**, **Hostel Resident / Student**, **Hostel Accountant**, **Maintenance Crew / Staff**).
   - Instant 1-click role switcher chip in the navigation bar for seamless live demonstrations.
3. **Smart Bed & Room Allocation Engine**:
   - Manual visual bed selection across 4 campus residential blocks (Hostel A, B, C, D).
   - **Smart Auto-Allocation Algorithm**: automatically matches student gender, course year, AC/Non-AC preference, and sharing tier (Single, Double, Triple) with capacity locking.
4. **Interactive Floor-by-Floor Blueprint**:
   - Visual corridor matrix showing occupied vs vacant bed slots, live occupancy meters, and resident dossiers on click.
5. **Fee Ledger & Digital Receipt Generator**:
   - Fee invoice generation, partial payments, payment tracking across UPI, Bank Transfer, Card, and Cash.
   - **Printable E-Receipts**: Official downloadable/printable fee receipts with institution seal, transaction ref, and tax compliance details.
6. **Curfew & Daily Roll-Call Attendance**:
   - 4-state roll-call sheet (`Present`, `Absent`, `Late`, `On Leave`), mark-all-present shortcut, and date-filtered exports.
7. **Complaints & Maintenance Ticket Lifecycle**:
   - Categorized grievances (`Electrical`, `Plumbing`, `Internet`, `Cleaning`, `Food/Mess`, `Security`).
   - Priority levels (`Low`, `Medium`, `High`, `Urgent`), staff technician dispatch, and resolution notes.
8. **Outstation Leave Requests & Gate Passes**:
   - Multi-day student travel applications with emergency contacts and destination logs.
   - **Printable Gate Out-Pass**: Official security pass with QR code simulation and warden approval stamp.
9. **24/7 Security Gate Visitor Registry**:
   - Visitor pass generator, Aadhaar ID verification log, host resident linkage, and real-time Check-In / Check-Out time recording.
10. **Central Mess & Dining Timetable**:
    - 7-day 4-meal schedule (Breakfast, Lunch, Evening Snacks, Dinner), chef specials, and student star ratings & reviews.
11. **Estate Asset & Inventory Control**:
    - Asset registry (furniture, electronics, bedding, appliances), stock-in / stock-out ledger, damage tracking, and low-stock alerts.
12. **12 Comprehensive Audit & Compliance Reports**:
    - Real-time tabular previews and 1-click CSV exports for all operational, residential, and financial domains.
13. **Dark / Light Theme & Global Command Palette**:
    - Universal `Ctrl + K` global search across students, rooms, complaints, staff, and circulars.
    - Persistent Dark/Light mode theme toggle.
14. **100% Functional & Zero Dead Buttons**:
    - Every action button triggers a reactive state mutation, modal dialog, printable document, or CSV download. All mutations persist across browser refreshes via `localStorage`.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with responsive mobile-first grid and dark mode support
- **Icons**: [Lucide React](https://lucide.dev/) (300+ vector icons)
- **Charts & Data Visualizations**: Pure SVG interactive responsive charting components (`DonutChart`, `BarChart`, `LineChart`)
- **State Engine**: Context API with reactive `HostelContext` supporting full local storage persistence and dynamic KPI recalculation
- **Export & Printing**: Universal CSV export engine and browser-native print stylesheets (`@media print`)

---

## 👥 Demo Personas & Login Credentials

Use the **Role Switcher** in the top navigation bar or the **Auth Modal** on the landing page for instantaneous 1-click access:

| Role | Demo User Name | Email / Login | Scope of Access |
| :--- | :--- | :--- | :--- |
| **Admin** | Dr. Rajesh Sharma | `admin@hostelhub.com` | Complete access to all 20 modules, settings, student enrollment, fee collection, staff roster & database backup |
| **Warden** | Prof. Sunita Deshmukh | `warden@hostelhub.com` | Residential blocks, daily roll-call attendance, leave approvals, complaints, visitor logs & notices |
| **Student** | Rahul Sharma | `rahul@student.hostelhub.com` | Personal room dossier, fee dues, file complaints, apply for outstation leave, mess menu & reviews |
| **Accountant** | Manoj Verma | `accountant@hostelhub.com` | Financial dashboard, invoice generator, record payments, defaulters ledger & printable receipts |
| **Staff** | Ramesh Yadav | `staff@hostelhub.com` | Maintenance work orders, complaints dispatcher, estate inventory & duty shifts |

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher) and npm installed.

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Vite Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Step 3: Production Build & Preview
```bash
# Build production bundle with TypeScript verification
npm run build

# Preview production build locally
npm run preview
```

---

## 🎤 College Project Presentation Demo Script (30 Steps)

Follow this structured workflow during your project viva or college demonstration to show off the system's depth:

1. **Public Showcase (Landing Page)**:
   - Click "Landing Page" from the top bar to display the campus marketing portal.
   - Point out the 4 residential blocks (`Aryabhata Boys`, `Kalpana Chawla Girls`, `Homi Bhabha Boys`, `Sarojini Naidu Girls`), amenities grid, fee calculator, and inquiry form.
2. **1-Click Admin Login**:
   - Click **"Explore Live Demo"** or **"Admin Login"** to enter the portal as **Dr. Rajesh Sharma (Admin)**.
3. **Executive Admin Dashboard**:
   - Highlight the 8 real-time KPI cards (Total Students: 30+, Occupancy: 88%, Monthly Collections: ₹4.8L, Pending Complaints, etc.).
   - Hover over the interactive SVG Occupancy Bar Chart, Complaints Donut Chart, and Revenue Trend Line.
4. **Student Management**:
   - Navigate to **Students** in the sidebar.
   - Use the live search to filter by name (`"Priya"`), course (`"B.Tech CSE"`), or hostel block.
   - Click **"View Profile"** on any student to open the comprehensive **6-tab student dossier** (Profile, Fee Invoices, Attendance Log, Grievances, Outstation Leaves, and Visitors).
5. **Enroll a New Student**:
   - Click **"+ Add Student"** and enter a student record (`"Aarav Mehta"`, Roll: `CS-2026-99`, Course: `B.Tech Mechanical`). Save and show how the directory and counter immediately increment.
6. **Smart Room Allocation (Manual)**:
   - Go to **Room Allocation** or click the bed icon on an unallocated student.
   - Select **Manual Mode**, pick **Hostel A**, **Floor 2**, **Room A-201**, and **Bed A**. Submit and show the confirmation toast.
7. **Smart Room Allocation (Auto Algorithm)**:
   - Switch to **Auto-Allocate Mode**. Pick a student, choose preferences (e.g., Girls Hostel, Double Sharing, AC).
   - Click **"Run Smart Auto-Allocate"**; explain how the algorithm inspects gender eligibility, room type, and capacity before locking the bed slot.
8. **Floor-by-Floor Blueprint Matrix**:
   - Go to **Floor Blueprint** under Hostels.
   - Switch between Ground Floor, 1st Floor, and 2nd Floor.
   - Click on any occupied bed to inspect the resident's profile directly, or click a vacant bed to allocate on the fly.
9. **Fee Invoicing & Payment Collection**:
   - Navigate to **Fees & Payments**.
   - Show the summary breakdown (Total Invoiced, Total Collected, Pending Balance).
   - Select a student with pending balance and click **"Record Payment"**.
   - Input ₹25,000 via UPI (`UPI-REF-98124`). Check the **"Open Printable Receipt Immediately"** box.
10. **Digital Printable E-Receipt**:
    - Demonstrate the professional fee receipt formatted with the college banner, student roll number, line-item table, and authorized sign-off box.
11. **Daily Roll-Call Attendance**:
    - Go to **Attendance**.
    - Toggle between students using the 4 status pills (`Present`, `Absent`, `Late`, `On Leave`).
    - Click **"Mark All Present"** for instant bulk roll-call, and click **"Export Sheet"** to generate an attendance CSV.
12. **Complaints Workflow**:
    - Navigate to **Complaints**.
    - Show issue tickets sorted by priority (`Urgent`, `High`, `Medium`, `Low`).
    - Open an unassigned electrical complaint and assign technician **"Ramesh Yadav (Electrician)"**.
    - Update the ticket status to **"In Progress"** or **"Resolved"** and add resolution remarks.
13. **Estate Maintenance**:
    - Go to **Maintenance**.
    - Review estate work orders with repair cost logging and urgency badges.
14. **Outstation Leave Requests**:
    - Navigate to **Leave Requests**.
    - Show pending requests from students visiting home.
    - Click **"Approve"** on a pending leave.
    - Click **"Print Gate Pass"** to display the official outstation security gate pass with warden authorization.
15. **24/7 Security Gate Visitors Log**:
    - Go to **Visitors Log**.
    - Show active visitors on campus.
    - Click **"+ Register Visitor"** and register a guardian visiting a student with Aadhaar ID verification.
    - Click **"Check Out"** on an existing visitor to log the exact departure timestamp.
16. **Campus Notice Board**:
    - Go to **Notice Board**.
    - View pinned priority notices and circulars.
    - Click **"+ Post Notice"** to publish a high-priority advisory to all residents.
17. **Central Mess & Dining Timetable**:
    - Go to **Mess & Dining**.
    - Inspect the 7-day 4-meal roster (Breakfast, Lunch, Evening Snacks, Dinner).
    - Show the average student food ratings and reviews.
18. **Asset & Inventory Management**:
    - Go to **Inventory Assets**.
    - Show stock alerts for low inventory. Click **"Stock In"** or **"Stock Out"** on mattresses/study lamps to see the live threshold recalculation.
19. **Staff Directory**:
    - Navigate to **Staff Directory**.
    - Filter staff by designation (Wardens, Security, Electricians, Plumbers, Cooks) and view their shift timings.
20. **12 Audit Reports Center**:
    - Navigate to **Reports & Analytics**.
    - Switch across all 12 operational and financial reports.
    - Click **"Download CSV Audit"** to demonstrate instant CSV generation with realistic Indian data.
21. **Global Search (`Ctrl + K`)**:
    - Press `Ctrl + K` (or click Search in the navbar).
    - Type `"Sharma"`, `"A-101"`, or `"Fan"` to show instant cross-module search.
22. **Theme Switching**:
    - Click the Sun/Moon icon in the navbar to toggle between high-contrast Light mode and sleek Dark mode.
23. **Switch to Student Portal**:
    - Open the Role Switcher chip in the navbar and select **Student (Rahul Sharma)**.
    - Show how the sidebar dynamically filters to student-relevant modules (`Dashboard`, `My Room & Bed`, `My Complaints`, `Apply Leave`, `Mess Menu`).
    - Show Rahul's personalized room card, roommate details, fee balance, and today's 4 meals.
24. **Student Files a Complaint & Leave**:
    - From the Student Dashboard, click **"Submit Grievance"** to file an internet connectivity issue.
    - Click **"Apply for Outstation Pass"** to submit a weekend leave.
25. **Switch to Accountant Portal**:
    - Switch role to **Manoj Verma (Accountant)**.
    - Show the revenue analytics, payment channels breakdown (UPI vs Bank vs Card vs Cash), and defaulters roster.
26. **Switch to Warden Portal**:
    - Switch role to **Prof. Sunita Deshmukh (Warden)**.
    - Show the morning roll-call alerts, pending leaves ready for 1-click approval, and open block complaints.
27. **System Settings & Data Management**:
    - Switch back to **Admin** and navigate to **Settings**.
    - Show institution policies, curfew timers (`21:30`), and email alerts.
    - Click **"Download JSON Backup"** to demonstrate complete state serialization.
    - Point out the **"Reset All Data"** safeguard button that restores the pristine demo dataset with one click.
28. **Explain Architecture & Clean Code**:
    - Explain the modular folder structure (`src/components/`, `src/context/`, `src/types/`, `src/utils/`).
    - Highlight TypeScript type safety with zero `any` shortcuts in models.
29. **Responsive Design**:
    - Open Chrome DevTools (`F12`), toggle mobile view (iPhone/Pixel), and demonstrate the collapsible drawer sidebar and adaptive tables.
30. **Summary & Viva Conclusion**:
    - Conclude by summarizing how HostelHub delivers a commercial SaaS experience solving all residential campus management challenges.

---

## 📂 Project Directory Structure

```
hostel-management-system-website/
├── index.html                 # App root with Google Fonts & responsive viewport
├── package.json               # Dependencies & build scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind typography, theme & colors configuration
├── tsconfig.json              # TypeScript compilation rules
├── vite.config.ts             # Vite server & bundler settings
├── src/
│   ├── main.tsx               # App mount with Theme, Auth, Hostel & Toast providers
│   ├── App.tsx                # Main layout coordinator, module router & modals
│   ├── index.css              # Global styles, scrollbar aesthetics & print media
│   ├── types/
│   │   └── index.ts           # Comprehensive TypeScript interfaces for all 20+ entities
│   ├── data/
│   │   └── initialData.ts     # Realistic Indian demo dataset (30+ students, 4 hostels, 40 rooms)
│   ├── context/
│   │   ├── AuthContext.tsx    # Role-based access control & 1-click persona switcher
│   │   ├── HostelContext.tsx  # Central reactive state engine with localStorage sync
│   │   └── ThemeContext.tsx   # Dark/Light theme coordinator
│   ├── utils/
│   │   ├── formatters.ts      # Currency (₹), date formatters, and universal CSV exporter
│   │   ├── receiptGenerator.ts# Printable e-receipt renderer with institution layout
│   │   └── leavePassGenerator.ts # Printable student gate out-pass generator
│   └── components/
│       ├── common/            # Navbar, Sidebar, Breadcrumb, Modals, StatCards, SearchModal
│       ├── charts/            # BarChart, DonutChart, LineChart (pure SVG)
│       ├── landing/           # Public marketing portal, AuthModal, FAQs, Contact Form
│       ├── dashboard/         # Role-specific dashboards (Admin, Warden, Student, Accountant)
│       ├── students/          # Student directory, 6-tab profile dossier, enrollment modal
│       ├── allocation/        # Manual & Smart Auto-Allocation engine
│       ├── hostels/           # Hostel buildings overview, RoomGrid, FloorView
│       ├── admissions/        # Admissions pipeline, application review & approval
│       ├── fees/              # Fee invoices, payments roster, record payment modal
│       ├── attendance/        # Daily roll-call sheet with 4-state toggles
│       ├── complaints/        # Issue tracking, technician dispatch & resolution
│       ├── maintenance/       # Estate repair work orders & expenditure logs
│       ├── leaves/            # Outstation leave applications & gate pass approvals
│       ├── visitors/          # Security gate register with check-in/out stamps
│       ├── notices/           # Broadcast circulars with priority tags
│       ├── mess/              # Weekly meal timetable & student dining feedback
│       ├── inventory/         # Asset tracking, stock movements & low-stock alerts
│       ├── staff/             # Campus staff registry, duty shifts & contact directory
│       ├── reports/           # 12 exportable audit reports with CSV download
│       └── settings/          # Campus policy configurations, database JSON backup & demo reset
```

---

## 📜 License & Acknowledgements
- Developed for academic project evaluations, software engineering capstone portfolios, and commercial campus deployments.
- Built with modern open-source web standards. All sample student and institutional data is synthetically generated for demonstration.
