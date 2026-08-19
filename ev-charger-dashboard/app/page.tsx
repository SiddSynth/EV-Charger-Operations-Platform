"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_BASE_URL } from "@/app/config";

type ChargerStats = {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
};

const recentActivity = [
  {
    message: "CH-003 went offline",
    time: "10 minutes ago",
    type: "offline",
  },
  {
    message: "Maintenance ticket MT-002 updated",
    time: "25 minutes ago",
    type: "maintenance",
  },
  {
    message: "CH-018 started charging",
    time: "42 minutes ago",
    type: "charging",
  },
];

export default function Home() {
  const router = useRouter();

  const [stats, setStats] = useState<ChargerStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
  const user = localStorage.getItem("user");

  if (!user) {
    router.push("/login");
    return;
  }

  const fetchStats = () => {
    fetch(`${API_BASE_URL}/chargers/stats`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Failed to fetch charger stats:", error);
      });
  };

  fetchStats();

  const interval = setInterval(fetchStats, 5000);

  return () => clearInterval(interval);
}, [router]);

  if (!stats) {
    return (
      <main className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <section className="flex-1 p-8">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 font-medium text-slate-700">
                Loading dashboard...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const onlinePercentage =
    stats.total > 0
      ? Math.round((stats.online / stats.total) * 100)
      : 0;

  const offlinePercentage =
    stats.total > 0
      ? Math.round((stats.offline / stats.total) * 100)
      : 0;

  const maintenancePercentage =
    stats.total > 0
      ? Math.round((stats.maintenance / stats.total) * 100)
      : 0;

  const chargerStatus = [
    {
      label: "Online",
      count: stats.online,
      percentage: onlinePercentage,
      bar: "bg-green-500",
      dot: "bg-green-500",
      text: "text-green-600",
    },
    {
      label: "Offline",
      count: stats.offline,
      percentage: offlinePercentage,
      bar: "bg-red-500",
      dot: "bg-red-500",
      text: "text-red-600",
    },
    {
      label: "Maintenance",
      count: stats.maintenance,
      percentage: maintenancePercentage,
      bar: "bg-yellow-500",
      dot: "bg-yellow-500",
      text: "text-yellow-600",
    },
  ];

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <section className="flex-1 p-8">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Operations Dashboard
            </p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              EV Charger Operations
            </h1>

            <p className="mt-2 text-slate-600">
              Real-time overview of your EV charging infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            Updated at {lastUpdated}
          </div>
        </div>

        {/* KPI Cards */}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Chargers
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                ⚡
              </div>
            </div>

            <p className="mt-4 text-4xl font-bold text-slate-900">
              {stats.total}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Registered chargers
            </p>
          </div>

          {/* Online */}

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Online
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>

            <p className="mt-4 text-4xl font-bold text-green-600">
              {stats.online}
            </p>

            <p className="mt-2 text-sm text-green-600">
              {onlinePercentage}% operational
            </p>
          </div>

          {/* Offline */}

          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Offline
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <span className="h-3 w-3 rounded-full bg-red-500" />
              </div>
            </div>

            <p className="mt-4 text-4xl font-bold text-red-600">
              {stats.offline}
            </p>

            <p className="mt-2 text-sm text-red-600">
              {offlinePercentage}% of infrastructure
            </p>
          </div>

          {/* Maintenance */}

          <div className="rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Maintenance
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
              </div>
            </div>

            <p className="mt-4 text-4xl font-bold text-yellow-600">
              {stats.maintenance}
            </p>

            <p className="mt-2 text-sm text-yellow-600">
              {maintenancePercentage}% of infrastructure
            </p>
          </div>
        </div>

        {/* Main Dashboard */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Charger Status */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Charger Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current infrastructure health
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                Live
              </span>
            </div>

            <div className="mt-8 space-y-7">
              {chargerStatus.map((status) => (
                <div key={status.label}>

                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${status.dot}`}
                      />

                      <span className="font-medium text-slate-700">
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${status.text}`}>
                        {status.count}
                      </span>

                      <span className="text-xs text-slate-400">
                        ({status.percentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${status.bar}`}
                      style={{
                        width: `${Math.max(
                          status.percentage,
                          status.count > 0 ? 2 : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest operational events
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Last hour
              </span>
            </div>

            <div className="mt-6 space-y-1">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl p-3 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1 h-3 w-3 rounded-full ${
                        activity.type === "offline"
                          ? "bg-red-500"
                          : activity.type === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />

                    {index !== recentActivity.length - 1 && (
                      <span className="mt-2 h-full w-px bg-slate-200" />
                    )}
                  </div>

                  <div className="pb-4">
                    <p className="font-medium text-slate-800">
                      {activity.message}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Overview */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Operational Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Key indicators from the current charger fleet
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Operational Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {onlinePercentage}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Chargers currently online
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Offline Chargers
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.offline}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Requiring operational attention
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Maintenance Load
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.maintenance}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Chargers under maintenance
              </p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}