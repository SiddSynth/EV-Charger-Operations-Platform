"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { API_BASE_URL } from "@/app/config";

type Charger = {
  id: number;
  stationName: string;
  city: string;
  state: string;
  operator: string;
  connectorType: string;
  powerKw: number;
  status: string;
};

export default function ChargersPage() {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/chargers`)
      .then((response) => response.json())
      .then((data) => {
        setChargers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch chargers:", error);
        setLoading(false);
      });
  }, []);

  const states = [
  "All",
  ...Array.from(
    new Set(
      chargers.map((charger) => {
        const state = charger.state.trim().toLowerCase();

        return state
          .split(" ")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(" ");
      })
    )
  ).sort(),
];

  const filteredChargers = chargers.filter((charger) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      charger.stationName.toLowerCase().includes(searchText) ||
      charger.city.toLowerCase().includes(searchText) ||
      charger.operator.toLowerCase().includes(searchText);

    const matchesState =
      stateFilter === "All" ||
      charger.state.trim().toLowerCase() ===
        stateFilter.toLowerCase();

    return matchesSearch && matchesState;
  });

  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Chargers
        </h1>

        <p className="mt-2 text-slate-600">
          Monitor and manage EV charging infrastructure.
        </p>

        {/* Search and Filter */}

        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search station, city or operator..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          />

          <select
            value={stateFilter}
            onChange={(event) => setStateFilter(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-slate-900 outline-none focus:border-blue-500"
          >
            {states.map((state) => (
              <option 
                key={state} 
                value={state}
                className="bg-white text-slate-900" 
                >
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredChargers.length} of {chargers.length} chargers
        </div>

        {loading ? (
          <p className="mt-8 text-gray-600">
            Loading chargers...
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-4">Station</th>
                  <th className="p-4">City</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Connector</th>
                  <th className="p-4">Power</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody className="text-slate-700">
                {filteredChargers.map((charger) => (
                  <tr
                    key={charger.id}
                    className="border-b border-gray-100"
                  >
                    <td className="p-4 font-medium text-slate-900">
                      {charger.stationName}
                    </td>

                    <td className="p-4">
                      {charger.city}
                    </td>

                    <td className="p-4">
                      {charger.state}
                    </td>

                    <td className="p-4">
                      {charger.operator}
                    </td>

                    <td className="p-4">
                      {charger.connectorType}
                    </td>

                    <td className="p-4">
                      {charger.powerKw} kW
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {charger.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredChargers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-gray-500"
                    >
                      No chargers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}