import { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("CyberGuard123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-slate-900 p-8 shadow-2xl shadow-cyan-500/10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-cyan-400">
            🛡️ CyberGuard
          </h1>

          <p className="mt-2 text-slate-400">
            Secure SOC Platform Login
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-slate-800/70 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-300">Demo Accounts</p>
          <p>Admin: admin / CyberGuard123</p>
          <p>Analyst: analyst / Analyst123</p>
        </div>
      </div>
    </div>
  );
}