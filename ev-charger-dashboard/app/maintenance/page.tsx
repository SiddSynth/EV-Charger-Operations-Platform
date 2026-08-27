"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { API_BASE_URL } from "@/app/config";

type Ticket = {
  id: number;
  issue: string;
  priority: string;
  status: string;
  createdAt: string;
  charger: {
    id: number;
    stationName: string;
    city: string;
  };
};

type Charger = {
  id: number;
  stationName: string;
  city: string;
  state: string;
};

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [chargerId, setChargerId] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  function fetchTickets() {
    fetch(`${API_BASE_URL}/maintenance`)
      .then((response) => response.json())
      .then((data: Ticket[]) => {
        const priorityOrder: Record<string, number> = {
          high: 1,
          medium: 2,
          low: 3,
        };

        const sortedTickets = [...data].sort((a, b) => {
          // 1. Sort by status (Open tickets first)
          const isAOpen = a.status.toLowerCase() === "open";
          const isBOpen = b.status.toLowerCase() === "open";
          if (isAOpen !== isBOpen) {
            return isAOpen ? -1 : 1;
          }

          // 2. Sort by priority (High -> Medium -> Low)
          const priorityA = priorityOrder[a.priority.toLowerCase()] || 99;
          const priorityB = priorityOrder[b.priority.toLowerCase()] || 99;
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // 3. Sort by ID (newest first)
          return b.id - a.id;
        });

        setTickets(sortedTickets);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to fetch maintenance tickets:",
          error
        );
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchTickets();

    fetch(`${API_BASE_URL}/chargers`)
      .then((response) => response.json())
      .then((data) => {
        setChargers(data);
      })
      .catch((error) => {
        console.error(
          "Failed to fetch chargers:",
          error
        );
      });
  }, []);

  async function handleCreateTicket(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (!chargerId || !issue.trim()) {
      setError("Please select a charger and enter an issue.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/maintenance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chargerId: Number(chargerId),
            issue: issue.trim(),
            priority,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      setChargerId("");
      setIssue("");
      setPriority("Medium");
      setShowModal(false);

      fetchTickets();
    } catch (error) {
      console.error(
        "Failed to create maintenance ticket:",
        error
      );

      setError(
        "Failed to create ticket. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResolveTicket(id: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/maintenance/${id}/resolve`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve ticket");
      }

      fetchTickets();
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
      alert("Failed to resolve ticket. Please try again.");
    }
  }

  function closeModal() {
    if (submitting) return;

    setShowModal(false);
    setError("");
    setChargerId("");
    setIssue("");
    setPriority("Medium");
  }

  const openTickets = tickets.filter(
    (ticket) => ticket.status.toLowerCase() === "open"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) =>
      ticket.priority.toLowerCase() === "high" &&
      ticket.status.toLowerCase() === "open"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status.toLowerCase() === "resolved" ||
      ticket.status.toLowerCase() === "closed"
  ).length;

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <section className="flex-1 p-8">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Service & Maintenance
            </p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              Maintenance Operations
            </h1>

            <p className="mt-2 text-slate-600">
              Track and manage maintenance issues across EV chargers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!loading && (
              <div
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm ${
                  openTickets > 0
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    openTickets > 0
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />

                {openTickets > 0
                  ? `${openTickets} Open Ticket${
                      openTickets > 1 ? "s" : ""
                    }`
                  : "No Open Tickets"}
              </div>
            )}

            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              + Create Ticket
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 font-medium text-slate-700">
                Loading maintenance tickets...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

              <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Open Tickets
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {openTickets}
                </p>

                <p className="mt-1 text-sm text-yellow-600">
                  Currently requiring attention
                </p>
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  High Priority
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {highPriorityTickets}
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Priority maintenance issues
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {resolvedTickets}
                </p>

                <p className="mt-1 text-sm text-green-600">
                  Completed maintenance tickets
                </p>
              </div>
            </div>

            {/* Tickets */}

            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Maintenance Tickets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {tickets.length} total ticket
                  {tickets.length !== 1 ? "s" : ""} in the system
                </p>
              </div>

              {tickets.length === 0 ? (
                <div className="rounded-2xl border border-green-200 bg-white p-12 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                    <span className="text-xl text-green-600">
                      ✓
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No active maintenance tickets
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    All chargers are currently operating normally.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-4 text-sm font-semibold">
                          Ticket
                        </th>

                        <th className="p-4 text-sm font-semibold">
                          Charger
                        </th>

                        <th className="p-4 text-sm font-semibold">
                          Issue
                        </th>

                        <th className="p-4 text-sm font-semibold">
                          Priority
                        </th>

                        <th className="p-4 text-sm font-semibold">
                          Status
                        </th>

                        <th className="p-4 text-sm font-semibold">
                          Created
                        </th>

                        <th className="p-4 text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {tickets.map((ticket) => {
                        const isHigh =
                          ticket.priority.toLowerCase() === "high";

                        const isOpen =
                          ticket.status.toLowerCase() === "open";

                        return (
                          <tr
                            key={ticket.id}
                            className="border-b border-slate-100 transition hover:bg-slate-50"
                          >
                            <td className="p-4">
                              <span className="font-semibold text-slate-900">
                                MT-
                                {String(ticket.id).padStart(3, "0")}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="font-semibold text-slate-900">
                                CH-
                                {String(ticket.charger.id).padStart(
                                  3,
                                  "0"
                                )}
                              </div>

                              <div className="mt-1 max-w-xs text-sm text-slate-500">
                                {ticket.charger.stationName}
                              </div>

                              <div className="mt-1 text-xs text-slate-400">
                                {ticket.charger.city}
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="font-medium text-slate-700">
                                {ticket.issue}
                              </span>
                            </td>

                            <td className="p-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  isHigh
                                    ? "bg-red-50 text-red-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {ticket.priority}
                              </span>
                            </td>

                            <td className="p-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  isOpen
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-green-50 text-green-700"
                                }`}
                              >
                                {ticket.status}
                              </span>
                            </td>

                            <td className="p-4 text-sm text-slate-500">
                              {new Date(
                                ticket.createdAt
                              ).toLocaleDateString()}
                            </td>

                            <td className="p-4">
                              {isOpen && (
                                <button
                                  onClick={() => handleResolveTicket(ticket.id)}
                                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700"
                                >
                                  Resolve
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Create Ticket Modal */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Maintenance
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Create Ticket
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Report an issue with an EV charger.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleCreateTicket}
              className="mt-6 space-y-5"
            >

              {/* Charger */}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Charger
                </label>

                <select
                  value={chargerId}
                  onChange={(event) =>
                    setChargerId(event.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">
                    Select a charger
                  </option>

                  {chargers.map((charger) => (
                    <option
                      key={charger.id}
                      value={charger.id}
                    >
                      CH-{String(charger.id).padStart(3, "0")} —{" "}
                      {charger.stationName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue */}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Issue
                </label>

                <input
                  type="text"
                  value={issue}
                  onChange={(event) =>
                    setIssue(event.target.value)
                  }
                  placeholder="e.g. Connector not working"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Priority */}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}