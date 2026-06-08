import { useEffect, useState } from "react";
import api from "../services/api";

export default function AuditTimeline() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/audit-logs")
      .then((response) => setLogs(response.data))
      .catch((error) => console.error("Failed to load audit logs", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-300">Loading audit timeline...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          📜 Audit Timeline
        </h1>
        <p className="mt-2 text-slate-400">
          Trace analyst activity, administrative actions, and security-relevant workflow events.
        </p>
      </div>

      <div className="relative border-l border-cyan-500/30 pl-6">
        {logs.map((log) => (
          <div key={log.id} className="mb-8">
            <div className="absolute -left-2 h-4 w-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40"></div>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">
                  {log.action}
                </h2>

                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {log.timestamp}
                </span>
              </div>

              <p className="text-slate-300">{log.details}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                  User: {log.username}
                </span>

                <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                  Role: {log.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}