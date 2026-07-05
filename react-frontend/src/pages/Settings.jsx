import { useEffect, useState } from "react";
import api from "../services/api";

export default function Settings({ showToast }) {
  const username = localStorage.getItem("cyberguard_user") || "Unknown";
  const role = localStorage.getItem("cyberguard_role") || "Unknown";
  const token = localStorage.getItem("cyberguard_token");
  const [postgresStatus, setPostgresStatus] = useState("Checking...");
  const [postgresMessage, setPostgresMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [apiMessage, setApiMessage] = useState("");
  const [lastChecked, setLastChecked] = useState("");
  const [postgresTables, setPostgresTables] = useState([]);

  async function checkApiHealth() {
    try {
      setApiStatus("Checking...");
      const response = await api.get("/");

      setApiStatus("Online");
      setApiMessage(response.data.message || "Backend is running successfully.");
      setLastChecked(new Date().toLocaleString());
      showToast?.("API connection verified successfully.", "success");
    } catch (error) {
      console.error("Failed to check API health", error);
      setApiStatus("Offline");
      setApiMessage("Unable to reach the FastAPI backend.");
      setLastChecked(new Date().toLocaleString());
      showToast?.("API connection failed. Backend may be offline.", "error");
    }
  }

  useEffect(() => {
  checkApiHealth();
  checkPostgresHealth();
  checkPostgresTables();
}, []);


  async function checkPostgresHealth() {
  try {
    setPostgresStatus("Checking...");

    const response = await api.get("/postgres-test");

    if (response.data.status === "connected") {
      setPostgresStatus("Connected");
      setPostgresMessage(response.data.version);
      showToast?.("PostgreSQL connection verified successfully.", "success");
    } else {
      setPostgresStatus("Failed");
      setPostgresMessage(response.data.error || "PostgreSQL connection failed.");
      showToast?.("PostgreSQL connection failed.", "error");
    }
  } catch (error) {
    console.error("Failed to check PostgreSQL health", error);
    setPostgresStatus("Failed");
    setPostgresMessage("Unable to reach PostgreSQL test endpoint.");
    showToast?.("PostgreSQL health check failed.", "error");
  }
}


async function checkPostgresTables() {
  try {
    const response = await api.get("/postgres/table-status");

    if (response.data.status === "success") {
      setPostgresTables(response.data.tables || []);
    }
  } catch (error) {
    console.error("Failed to check PostgreSQL table status", error);
    showToast?.("Failed to check PostgreSQL table status.", "error");
  }
}

  const roleAccess = {
    Administrator: "Full platform access including audit logs, executive reports, incidents, MITRE, settings, and subscriptions.",
    "SOC Analyst": "Operational SOC access including threat queue, incidents, MITRE review, notes, and limited protected-page visibility.",
    "SOC Manager": "SOC oversight access including dashboard, incidents, MITRE visibility, and operational monitoring.",
    Executive: "Executive reporting access including dashboard, executive summary, reports, subscriptions, and settings.",
  };

  return (

    

       
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          ⚙ Settings
        </h1>
        <p className="mt-2 text-slate-400">
          Manage CyberGuard account, session, API health, and platform security configuration.
        </p>

        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4">
  <p className="text-xs uppercase tracking-wide text-slate-500">
    PostgreSQL Health Message
  </p>
  <p className="mt-2 break-words text-sm text-slate-300">
    {postgresMessage || "No PostgreSQL health message available."}
  </p>

  <button
    onClick={checkPostgresHealth}
    className="mt-4 rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
  >
    Recheck PostgreSQL
  </button>
</div>

<div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4">
  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        PostgreSQL Table Status
      </p>
      <p className="mt-2 text-sm text-slate-300">
        Verifies that production database tables exist inside the Docker PostgreSQL container.
      </p>
    </div>

    <button
      onClick={checkPostgresTables}
      className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
    >
      Recheck Tables
    </button>
  </div>

  {postgresTables.length === 0 ? (
    <p className="mt-4 text-sm text-slate-500">
      No PostgreSQL table status available yet.
    </p>
  ) : (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      {postgresTables.map((table) => (
        <div key={table.table} className="rounded-xl bg-slate-800 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {table.table}
          </p>

          <p
            className={`mt-2 font-semibold ${
              table.exists ? "text-green-300" : "text-red-300"
            }`}
          >
            {table.exists ? "Exists" : "Missing"}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Rows: {table.rows}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
      </div>
              <div className="rounded-xl bg-slate-800 p-4">
  <p className="text-xs uppercase tracking-wide text-slate-500">
    PostgreSQL
  </p>
  <p
    className={`mt-2 font-semibold ${
      postgresStatus === "Connected"
        ? "text-green-300"
        : postgresStatus === "Failed"
        ? "text-red-300"
        : "text-yellow-300"
    }`}
  >
    {postgresStatus}
  </p>
</div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            User Profile
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Username
              </p>
              <p className="mt-2 font-semibold text-white">
                {username}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Role
              </p>
              <p className="mt-2 font-semibold text-cyan-300">
                {role}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Role Access Summary
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {roleAccess[role] || "No role access description available."}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current Plan
              </p>
              <p className="mt-2 font-semibold text-green-300">
                Enterprise Demo
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            Session Security
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  Session Token
                </p>
                <p className="text-sm text-slate-400">
                  Login token stored in local browser session storage.
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  token
                    ? "bg-green-500/10 text-green-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >
                {token ? "Active" : "Missing"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  API Authentication Headers
                </p>
                <p className="text-sm text-slate-400">
                  Axios sends X-Username and X-Role to protected backend endpoints.
                </p>
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-300">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  Backend RBAC
                </p>
                <p className="text-sm text-slate-400">
                  FastAPI checks role permissions before returning protected data.
                </p>
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-300">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
              <div>
                <p className="font-semibold text-white">
                  Audit Logging
                </p>
                <p className="text-sm text-slate-400">
                  Incident actions and notes are recorded for accountability.
                </p>
              </div>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                Available
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-cyan-300">
              Platform Status
            </h2>
            <p className="mt-2 text-slate-400">
              Live connection status for the CyberGuard React frontend and FastAPI backend.
            </p>
          </div>

          <button
            onClick={checkApiHealth}
            className="rounded-lg border border-cyan-500/30 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            Recheck API
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Frontend
            </p>
            <p className="mt-2 font-semibold text-green-300">
              React Online
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
  <p className="text-xs uppercase tracking-wide text-slate-500">
    PostgreSQL
  </p>
  <p
    className={`mt-2 font-semibold ${
      postgresStatus === "Connected"
        ? "text-green-300"
        : postgresStatus === "Failed"
        ? "text-red-300"
        : "text-yellow-300"
    }`}
  >
    {postgresStatus}
  </p>
</div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Backend
            </p>
            <p
              className={`mt-2 font-semibold ${
                apiStatus === "Online"
                  ? "text-green-300"
                  : apiStatus === "Offline"
                  ? "text-red-300"
                  : "text-yellow-300"
              }`}
            >
              FastAPI {apiStatus}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Backend URL
            </p>
            <p className="mt-2 break-all font-semibold text-cyan-300">
              http://127.0.0.1:8000
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Architecture
            </p>
            <p className="mt-2 font-semibold text-cyan-300">
              SaaS Ready
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            API Health Message
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {apiMessage || "No API health message available."}
          </p>

          {lastChecked && (
            <p className="mt-2 text-xs text-slate-500">
              Last checked: {lastChecked}
            </p>
          )}
        </div>
      </section>
        <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
  <h2 className="text-2xl font-bold text-cyan-300">
    Database Architecture
  </h2>

  <p className="mt-2 text-slate-400">
    CyberGuard is currently running in safe hybrid database mode for development and demonstration.
  </p>

  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Current App Storage
      </p>
      <p className="mt-2 font-semibold text-yellow-300">
        SQLite
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Used for safe local demo persistence.
      </p>
    </div>

    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Production Database
      </p>
      <p className="mt-2 font-semibold text-green-300">
        Docker PostgreSQL
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Running in a local container for production-style architecture.
      </p>
    </div>

    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Migration Status
      </p>
      <p className="mt-2 font-semibold text-cyan-300">
        Prepared
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Environment configuration and PostgreSQL health checks are ready.
      </p>
    </div>

    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Fallback Mode
      </p>
      <p className="mt-2 font-semibold text-purple-300">
        Enabled
      </p>
      <p className="mt-2 text-sm text-slate-400">
        SQLite remains available if PostgreSQL is offline during a demo.
      </p>
    </div>
  </div>

  <div className="mt-6 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">
    <p className="text-sm font-semibold text-cyan-300">
      Employer / Marker Explanation
    </p>
    <p className="mt-2 text-sm leading-6 text-slate-300">
      CyberGuard was first built with SQLite for rapid development and demo reliability.
      It now includes Dockerized PostgreSQL connectivity using environment-based configuration.
      This allows the system to demonstrate both local fallback resilience and production-style database readiness.
    </p>
  </div>
</section>
      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          Platform Capabilities
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">
              Persistent SQLite Storage
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Incidents, notes, metrics, audit logs, and executive reporting use stored backend data.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">
              Executive PDF Reports
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Executive reports are generated from live SOC data with role-protected access.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">
              MITRE ATT&CK Mapping
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Incidents are mapped to ATT&CK techniques, tactics, recommendations, and related cases.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}