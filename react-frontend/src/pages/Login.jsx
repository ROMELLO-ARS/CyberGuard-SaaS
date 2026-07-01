import { useState } from "react";
import api from "../services/api";

const demoAccounts = [
  {
    role: "Administrator",
    username: "admin",
    password: "CyberGuard123",
    description: "Full platform access, audit logs, executive reports, and system settings.",
  },
  {
    role: "SOC Analyst",
    username: "analyst",
    password: "Analyst123",
    description: "Threat triage, incidents, MITRE review, and analyst notes.",
  },
  {
    role: "SOC Manager",
    username: "manager",
    password: "Manager123",
    description: "SOC oversight, incidents, MITRE visibility, and operational monitoring.",
  },
  {
    role: "Executive",
    username: "executive",
    password: "Executive123",
    description: "Executive dashboard, posture summary, reports, and subscription overview.",
  },
];

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("CyberGuard123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function selectDemoAccount(account) {
    setUsername(account.username);
    setPassword(account.password);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        username,
        password,
      });

      localStorage.setItem("cyberguard_token", response.data.token);
      localStorage.setItem("cyberguard_user", response.data.username);
      localStorage.setItem("cyberguard_role", response.data.role);

      onLogin(response.data);
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-8 shadow-2xl shadow-cyan-500/10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cyan-400">
              🛡️ CyberGuard
            </h1>

            <p className="mt-2 text-slate-400">
              Secure SOC Platform Login
            </p>

            <p className="mt-4 leading-7 text-slate-300">
              Sign in with a demo role to experience role-based access control,
              incident management, MITRE mapping, audit logging, and executive reporting.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-sm text-slate-300">
            <p className="font-semibold text-cyan-300">
              Demo Tip
            </p>
            <p className="mt-2 text-slate-400">
              Click any role card to auto-fill its login credentials.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Demo Role Accounts
            </h2>
            <p className="mt-2 text-slate-400">
              Use these accounts to demonstrate frontend and backend role-based access control.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => selectDemoAccount(account)}
                className={`rounded-xl border p-4 text-left transition hover:border-cyan-400 hover:bg-cyan-500/10 ${
                  username === account.username
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-slate-700 bg-slate-950/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-cyan-300">
                    {account.role}
                  </h3>

                  <span className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300">
                    {account.username}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {account.description}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Username
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {account.username}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Password
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {account.password}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}