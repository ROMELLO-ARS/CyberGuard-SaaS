import { useEffect, useState } from "react";
import api from "../services/api";

function severityStyle(severity) {
  if (severity === "Critical") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (severity === "High") return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  if (severity === "Medium") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

export default function MitreCenter() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/mitre")
      .then((response) => setTechniques(response.data))
      .catch((error) => console.error("Failed to load MITRE data", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-300">Loading MITRE ATT&CK data...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          🎯 MITRE ATT&CK Center
        </h1>
        <p className="mt-2 text-slate-400">
          CyberGuard maps detected threats to industry-recognised MITRE ATT&CK tactics and techniques.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {techniques.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6"
          >
            <p className="text-sm text-slate-400">{item.tactic}</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{item.count}</h2>
            <p className="mt-1 text-xs text-cyan-300">{item.id}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {techniques.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {item.id} — {item.technique}
                </h2>
                <p className="mt-2 text-cyan-300">{item.tactic}</p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityStyle(
                  item.severity
                )}`}
              >
                {item.severity}
              </span>
            </div>

            <p className="mt-4 text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}