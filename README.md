# Dayflow HRMS

> Every workday, perfectly aligned.

Dayflow is a modern Human Resource Management System designed to bring employees, HR teams, attendance, leave, payroll, announcements, and workforce operations into one unified workspace.

The application uses a clean *Paper Motion* design system with an editorial visual style, ink-navy interfaces, saffron accents, tactile paper-inspired cards, and responsive layouts.

---

## 🚀 Overview

Dayflow helps organizations manage their workforce through a centralized HR platform.

Employees can manage their own attendance, leave requests, profile information, and payroll records, while HR/Admin users can manage employees, review requests, monitor workforce activity, and handle HR operations.

---

## ✨ Features

### 👤 Employee

- Personal employee dashboard
- Check-in and check-out
- Attendance history
- Workday tracking
- Leave requests
- Leave status tracking
- Profile management
- Payroll information
- Announcements
- Personal workforce activity

### 🧑‍💼 HR / Admin

- HR dashboard
- Employee directory
- Employee management
- Attendance monitoring
- Leave request approvals
- Payroll management
- Workforce analytics
- Announcements
- HR request management
- Team activity overview

### 📊 Workforce Management

- Attendance tracking
- Leave management
- Employee records
- Payroll workflows
- HR approvals
- Workforce insights
- Team pulse
- Action center

---

## 🎨 Design System

Dayflow follows a custom *Paper Motion* design system.

### Visual Language

- Editorial-style layouts
- Paper-inspired cards
- Ink navy primary color
- Dayflow saffron accent
- Soft cream backgrounds
- Subtle shadows
- Rounded asymmetric corners
- Micro-interactions
- Smooth animations
- Responsive layouts

### Color Palette

| Color | Usage |
|---|---|
| #172336 | Primary ink navy |
| #F9B62D | Dayflow saffron |
| #FBFAF6 | Main background |
| #FFFFFF | Cards and surfaces |
| #385442 | Success / sage |
| #B54538 | Error / destructive |

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Wouter
- Lucide React
- Recharts

### Backend

- Node.js
- Express
- TypeScript
- tRPC

### Database

- Drizzle ORM
- MySQL

### Development

- npm
- Git
- GitHub
- Prettier
- Vitest

---

## 📁 Project Structure

```text
dayflow-hrms/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       │   └── ui/
│       │
│       ├── contexts/
│       │
│       ├── hooks/
│       │
│       ├── lib/
│       │
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── AppDashboard.tsx
│       │   ├── EmployeeDirectory.tsx
│       │   ├── PayrollStudio.tsx
│       │   ├── RequestsCenter.tsx
│       │   ├── Announcements.tsx
│       │   ├── TeamPulse.tsx
│       │   ├── ActionCenter.tsx
│       │   └── NotFound.tsx
│       │
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
│
├── server/
│   ├── _core/
│   │   ├── index.ts
│   │   ├── env.ts
│   │   ├── trpc.ts
│   │   ├── systemRouter.ts
│   │   ├── imageGeneration.ts
│   │   └── ...
│   │
│   └── ...
│
├── shared/
│
├── drizzle/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md