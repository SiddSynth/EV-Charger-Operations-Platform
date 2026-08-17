"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  email: string;
  role: string;
};

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === "Admin";

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-900 p-6 text-white">
      <div>
        <h2 className="text-xl font-bold">
          EV Charger
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Operations Platform
        </p>

        {user && (
          <div className="mt-6 rounded-lg bg-slate-800 p-3">
            <p className="truncate text-sm text-slate-300">
              {user.email}
            </p>

            <p className="mt-1 text-xs font-semibold text-blue-400">
              {user.role}
            </p>
          </div>
        )}

        <nav className="mt-8 space-y-2">
          <Link
            href="/"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Dashboard
          </Link>

          <Link
            href="/chargers"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Chargers
          </Link>

          <Link
            href="/stations"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Stations
          </Link>

          <Link
            href="/maintenance"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Maintenance
          </Link>

          <Link
            href="/analytics"
            className="block rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            Analytics
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/users"
                className="block rounded-lg px-4 py-3 hover:bg-slate-800"
              >
                Users
              </Link>

              <Link
                href="/settings"
                className="block rounded-lg px-4 py-3 hover:bg-slate-800"
              >
                Settings
              </Link>
            </>
          )}
        </nav>
      </div>

      {user && (
        <button
          onClick={handleLogout}
          className="mt-auto rounded-lg bg-red-600 px-4 py-3 font-medium hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </aside>
  );
}