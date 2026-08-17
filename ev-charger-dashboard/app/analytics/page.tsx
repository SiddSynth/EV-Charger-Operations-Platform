"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

type Analytics = {
  totalChargers: number;
  totalPower: number;
  byState: Record<string, number>;
  byOperator: Record<string, number>;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/chargers/analytics")
      .then((response) => response.json())
      .then((data) => {
        setAnalytics(data);
      })
      .catch((error) => {
        console.error("Failed to fetch analytics:", error);
      });
  }, []);

  if (!analytics) {
    return (
      <main className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <section className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-4 text-gray-600">
            Loading analytics...
          </p>
        </section>
      </main>
    );
  }

  const states = Object.entries(analytics.byState);
  const operators = Object.entries(analytics.byOperator);

  const maxStateCount = Math.max(
    ...states.map(([, count]) => count),
    1
  );

  const maxOperatorCount = Math.max(
    ...operators.map(([, count]) => count),
    1
  );

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Analytics
        </h1>

        <p className="mt-2 text-slate-600">
          Overview of EV charging infrastructure.
        </p>

        {/* Stats */}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Total Chargers
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {analytics.totalChargers}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Total Charging Capacity
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {analytics.totalPower.toLocaleString()} kW
            </p>
          </div>
        </div>

        {/* Charts */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* State Distribution */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Chargers by State
            </h2>

            <div className="mt-6 space-y-5">
              {states.map(([state, count]) => (
                <div key={state}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">
                      {state}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {count}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-blue-600"
                      style={{
                        width: `${(count / maxStateCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Distribution */}

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              Chargers by Operator
            </h2>

            <div className="mt-6 space-y-5">
              {operators.map(([operator, count]) => (
                <div key={operator}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="max-w-[75%] truncate text-gray-600">
                      {operator}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {count}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-green-600"
                      style={{
                        width: `${(count / maxOperatorCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}