"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-slate-950">

      {/* Left Branding */}

      <section className="hidden flex-1 flex-col justify-between p-12 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
              EV
            </div>

            <div>
              <h1 className="font-bold">
                EV Charger
              </h1>

              <p className="text-xs text-slate-400">
                Operations Platform
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Operations Dashboard
          </p>

          <h2 className="mt-4 text-5xl font-bold leading-tight">
            Manage your charging network with confidence.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Monitor chargers, stations, maintenance activity
            and operational performance from one centralized
            platform.
          </p>

          <div className="mt-8 flex gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
              Charger Monitoring
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
              Maintenance
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">
              Analytics
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          EV Charger Operations Platform
        </p>
      </section>

      {/* Login */}

      <section className="flex w-full items-center justify-center bg-slate-50 p-6 lg:w-[520px]">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}

          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                EV
              </div>

              <div>
                <h1 className="font-bold text-slate-900">
                  EV Charger
                </h1>

                <p className="text-xs text-slate-500">
                  Operations Platform
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to access your operations dashboard.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="you@evcompany.com"
                  required
                />
              </div>

              {/* Password */}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Secure access to EV Charger Operations
          </p>

        </div>
      </section>

    </main>
  );
}