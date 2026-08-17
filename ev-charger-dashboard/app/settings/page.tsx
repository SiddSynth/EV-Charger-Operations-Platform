"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const [offlineAlerts, setOfflineAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const [employeeTickets, setEmployeeTickets] = useState(true);
  const [employeeAnalytics, setEmployeeAnalytics] = useState(true);

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-600">
          Configure operational settings for the EV charging platform.
        </p>

        <div className="mt-8 max-w-5xl space-y-6">

          {/* Organization */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Organization
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Basic organization information.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Organization Name
                </label>

                <input
                  type="text"
                  defaultValue="EV Charger Operations"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Support Email
                </label>

                <input
                  type="email"
                  defaultValue="support@evcharger.com"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Timezone
                </label>

                <select
                  defaultValue="Asia/Kolkata"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="Asia/Kolkata">
                    India Standard Time
                  </option>

                  <option value="Asia/Dubai">
                    Gulf Standard Time
                  </option>

                  <option value="UTC">
                    UTC
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Currency
                </label>

                <select
                  defaultValue="INR"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charger Operations */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Charger Operations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure how charger operations are monitored.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Offline Alert Threshold
                </label>

                <select
                  defaultValue="10"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Dashboard Auto Refresh
                </label>

                <select
                  defaultValue="30"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="15">Every 15 seconds</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every 1 minute</option>
                  <option value="300">Every 5 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose which operational events should trigger alerts.
            </p>

            <div className="mt-6 space-y-5">
              <SettingToggle
                title="Charger goes offline"
                description="Notify administrators when a charger becomes unavailable."
                enabled={offlineAlerts}
                onChange={setOfflineAlerts}
              />

              <SettingToggle
                title="Maintenance ticket created"
                description="Notify administrators when a new maintenance ticket is submitted."
                enabled={maintenanceAlerts}
                onChange={setMaintenanceAlerts}
              />

              <SettingToggle
                title="High-priority maintenance alert"
                description="Send alerts for high-priority maintenance issues."
                enabled={highPriorityAlerts}
                onChange={setHighPriorityAlerts}
              />

              <SettingToggle
                title="Daily operations summary"
                description="Receive a daily summary of charger operations."
                enabled={dailySummary}
                onChange={setDailySummary}
              />
            </div>
          </div>

          {/* Access Control */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Access Control
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure what employees can access.
            </p>

            <div className="mt-6 space-y-5">
              <SettingToggle
                title="Allow employees to create maintenance tickets"
                description="Employees can report charger issues from the maintenance section."
                enabled={employeeTickets}
                onChange={setEmployeeTickets}
              />

              <SettingToggle
                title="Allow employees to view analytics"
                description="Employees can access charger analytics and operational statistics."
                enabled={employeeAnalytics}
                onChange={setEmployeeAnalytics}
              />

              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <div>
                  <p className="font-medium text-slate-900">
                    User management
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Only administrators can manage users and roles.
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Admin Only
                </span>
              </div>
            </div>
          </div>

          {/* System Information */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              System Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard
                label="API Status"
                value="Connected"
                status="success"
              />

              <InfoCard
                label="Database"
                value="PostgreSQL"
                status="success"
              />

              <InfoCard
                label="Chargers"
                value="855"
                status="normal"
              />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function InfoCard({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "success" | "normal";
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {status === "success" && (
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        )}

        <p className="font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}