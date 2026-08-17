# EV Charger Operations Platform

A complete full-stack Operations Platform designed to manage and monitor a network of EV charging stations. This repository contains both the backend services and the frontend dashboard.

---

## 🏗️ Project Architecture

The application is built on a full-stack TypeScript architecture:

*   **Frontend**: Next.js 15 (App Router, Tailwind CSS, Client-side React Hooks).
*   **Backend**: NestJS (Modular Structure, REST APIs, Dependency Injection).
*   **Database**: PostgreSQL managed via TypeORM.

```
                  ┌──────────────────────────────┐
                  │      Next.js Frontend        │
                  │      (localhost:3000)        │
                  └──────────────┬───────────────┘
                                 │ HTTP / REST
                                 ▼
                  ┌──────────────────────────────┐
                  │      NestJS Backend API      │
                  │      (localhost:3001)        │
                  └──────────────┬───────────────┘
                                 │ TypeORM
                                 ▼
                  ┌──────────────────────────────┐
                  │     PostgreSQL Database      │
                  │       (ev_charger_db)        │
                  └──────────────────────────────┘
```

---

## 🌟 Key Features

1.  **Operations Dashboard**:
    *   Dynamic metrics for online, offline, and maintenance chargers.
    *   Automatic near-real-time updates via 5-second HTTP polling.
2.  **Chargers Directory**:
    *   Search and filter by location (state, city) and operator.
    *   Interactive listings of active chargers.
3.  **Stations View**:
    *   Client-side aggregation of chargers grouped by station name.
    *   Calculates availability rates per location dynamically.
4.  **Maintenance Ticketing**:
    *   Many-to-One database mapping connecting issues directly to individual chargers.
    *   Sorts tickets by priority (High/Medium/Low) and creation date.
5.  **Analytics & Performance Visuals**:
    *   Visual representation of charging infrastructure density by state and operator.
    *   Calculates cumulative network capacity in kW.
6.  **Mock Authentication & RBAC**:
    *   Role-based client views (Admin vs. Employee).
    *   Hides management controls (Users, Settings) from standard Employees.

---

## 🚀 Setup & Execution

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [PostgreSQL](https://www.postgresql.org/) (v14 or higher) running locally on port `5432`

---

### 1. Database Setup

1.  Create a local PostgreSQL database named `ev_charger_db`.
2.  Configure database credentials in the backend config (`app.module.ts`). Defaults are:
    *   **Host**: `localhost`
    *   **Port**: `5432`
    *   **Username**: `postgres`
    *   **Password**: `gababa`
    *   **Database**: `ev_charger_db`

---

### 2. Backend Server (`ev-charger-api`)

Navigate to the backend directory, install dependencies, seed the database, and start the application:

```bash
cd ev-charger-api

# Install dependencies
npm install

# Run database seeder (imports Indian EV station CSV data)
npm run seed

# Start server in development mode
npm run start:dev
```

The backend server will run on [http://localhost:3001](http://localhost:3001).

---

### 3. Frontend Dashboard (`ev-charger-dashboard`)

Navigate to the dashboard directory, install dependencies, and start the development server:

```bash
cd ev-charger-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Mock Credentials

Use these credentials to test role-based access:

| Email | Password | Role |
| :--- | :--- | :--- |
| `vishal@evcompany.com` | `admin123` | **Admin** (Full access to Users/Settings) |
| `satyam@evcompany.com` | `employee123` | **Employee** (Operations access only) |
| `rahul@evcompany.com` | `inactive123` | **Employee** (Inactive account simulation) |
