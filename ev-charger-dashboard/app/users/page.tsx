"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const initialUsers = [
  {
    id: 1,
    name: "Satyam",
    email: "satyam@evcompany.com",
    role: "Employee",
    status: "Active",
  },
  {
    id: 2,
    name: "Vishal",
    email: "vishal@evcompany.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul",
    email: "rahul@evcompany.com",
    role: "Employee",
    status: "Inactive",
  },
];

function getRoleStyle(role: string) {
  if (role === "Admin") {
    return "bg-purple-50 text-purple-700";
  }

  return "bg-blue-50 text-blue-700";
}

function getStatusStyle(status: string) {
  if (status === "Active") {
    return "bg-green-50 text-green-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);

  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const employeeCount = users.filter(
    (user) => user.role === "Employee"
  ).length;

  const activeCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  function toggleUserStatus(id: number) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <section className="flex-1 p-8">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Administration
            </p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>

            <p className="mt-2 text-slate-600">
              Manage employees, roles and platform access.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            + Add User
          </button>
        </div>

        {/* Summary Cards */}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalUsers}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Registered accounts
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Administrators
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {adminCount}
            </p>

            <p className="mt-1 text-sm text-purple-600">
              Full platform access
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Employees
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {employeeCount}
            </p>

            <p className="mt-1 text-sm text-blue-600">
              Operational access
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Users
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeCount}
            </p>

            <p className="mt-1 text-sm text-green-600">
              Currently enabled
            </p>
          </div>
        </div>

        {/* Users Table */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Platform Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage account status and access levels.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-4 text-sm font-semibold">
                    User
                  </th>

                  <th className="p-4 text-sm font-semibold">
                    Email
                  </th>

                  <th className="p-4 text-sm font-semibold">
                    Role
                  </th>

                  <th className="p-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="p-4 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* User */}

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                          {user.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            User #{String(user.id).padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="p-4 text-slate-600">
                      {user.email}
                    </td>

                    {/* Role */}

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="p-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`text-sm font-medium hover:underline ${
                          user.status === "Active"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {user.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Access Overview */}

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Access Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Permissions available to each platform role.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* Admin */}

            <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  Administrator
                </h3>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  Full Access
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Permission label="Chargers" />
                <Permission label="Stations" />
                <Permission label="Maintenance" />
                <Permission label="Analytics" />
                <Permission label="User Management" />
                <Permission label="Settings" />
              </div>
            </div>

            {/* Employee */}

            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  Employee
                </h3>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Limited Access
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Permission label="Chargers" />
                <Permission label="Stations" />
                <Permission label="Maintenance" />
                <Permission label="Analytics" />
                <Permission label="User Management" disabled />
                <Permission label="Settings" disabled />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add User Modal */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add New User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a platform user account.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>

                <select
                  defaultValue="Employee"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option>Employee</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Permission({
  label,
  disabled = false,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
        disabled
          ? "bg-slate-50 text-slate-400"
          : "bg-green-50 text-slate-700"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
          disabled
            ? "bg-slate-200 text-slate-400"
            : "bg-green-100 text-green-600"
        }`}
      >
        {disabled ? "×" : "✓"}
      </span>

      {label}
    </div>
  );
}