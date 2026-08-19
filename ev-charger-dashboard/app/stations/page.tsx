"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { API_BASE_URL } from "@/app/config";

type Charger = {
  id: number;
  stationName: string;
  city: string;
  state: string;
  status: string;
};

type Station = {
  stationName: string;
  city: string;
  state: string;
  chargers: number;
  online: number;
  offline: number;
};

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/chargers`)
      .then((response) => response.json())
      .then((data: Charger[]) => {
        const grouped: Record<string, Station> = {};

        data.forEach((charger) => {
          if (!grouped[charger.stationName]) {
            grouped[charger.stationName] = {
              stationName: charger.stationName,
              city: charger.city,
              state: charger.state,
              chargers: 0,
              online: 0,
              offline: 0,
            };
          }

          grouped[charger.stationName].chargers++;

          if (charger.status === "Online") {
            grouped[charger.stationName].online++;
          }

          if (charger.status === "Offline") {
            grouped[charger.stationName].offline++;
          }
        });

        setStations(Object.values(grouped));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch stations:", error);
        setLoading(false);
      });
  }, []);

  const totalChargers = stations.reduce(
    (total, station) => total + station.chargers,
    0
  );

  const totalOnline = stations.reduce(
    (total, station) => total + station.online,
    0
  );

  const totalOffline = stations.reduce(
    (total, station) => total + station.offline,
    0
  );

  const operationalRate =
    totalChargers > 0
      ? Math.round((totalOnline / totalChargers) * 100)
      : 0;

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <section className="flex-1 p-8">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Charging Network
            </p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              Stations
            </h1>

            <p className="mt-2 text-slate-600">
              Monitor the health and availability of your charging stations.
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="font-medium text-slate-700">
                Network Operational
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="mt-4 font-medium text-slate-700">
                Loading stations...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary */}

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Total Stations
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stations.length}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Charging locations
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Online Chargers
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {totalOnline}
                </p>

                <p className="mt-1 text-sm text-green-600">
                  {operationalRate}% operational
                </p>
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Offline Chargers
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {totalOffline}
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Requiring attention
                </p>
              </div>
            </div>

            {/* Station Grid */}

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Charging Stations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {stations.length} locations across the network
                  </p>
                </div>
              </div>

              {stations.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <p className="font-medium text-slate-700">
                    No stations found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {stations.map((station) => {
                    const stationRate =
                      station.chargers > 0
                        ? Math.round(
                            (station.online / station.chargers) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={station.stationName}
                        className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                      >
                        {/* Station Header */}

                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold leading-6 text-slate-900">
                              {station.stationName}
                            </h3>

                            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                              <span>📍</span>
                              {station.city}, {station.state}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              station.offline === 0
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {station.offline === 0
                              ? "Operational"
                              : "Attention"}
                          </span>
                        </div>

                        {/* Progress */}

                        <div className="mt-6">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                              Availability
                            </span>

                            <span className="text-xs font-semibold text-slate-700">
                              {stationRate}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-green-500 transition-all"
                              style={{
                                width: `${stationRate}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Stats */}

                        <div className="mt-6 grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-slate-50 p-3 text-center">
                            <p className="text-xs font-medium text-slate-500">
                              Chargers
                            </p>

                            <p className="mt-1 text-xl font-bold text-slate-900">
                              {station.chargers}
                            </p>
                          </div>

                          <div className="rounded-xl bg-green-50 p-3 text-center">
                            <p className="text-xs font-medium text-green-600">
                              Online
                            </p>

                            <p className="mt-1 text-xl font-bold text-green-600">
                              {station.online}
                            </p>
                          </div>

                          <div className="rounded-xl bg-red-50 p-3 text-center">
                            <p className="text-xs font-medium text-red-600">
                              Offline
                            </p>

                            <p className="mt-1 text-xl font-bold text-red-600">
                              {station.offline}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}