import { useEffect, useState } from "react";
import api from "../services/api";

function riskBadgeColor(risk) {
  if (risk === "Critical") return "border-red-500/30 bg-red-500/10 text-red-300";
  if (risk === "High") return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  if (risk === "Medium") return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

export default function ThreatQueue() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/alerts")
      .then((response) => {
        setAlerts(response.data);
      })
      .catch((error) => {
        console.error("Failed to load alerts", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-slate-300">Loading threat queue...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">🚨 Threat Queue</h1>
        <p className="mt-2 text-slate-400">
          Prioritised SOC alerts enriched with MITRE ATT&CK mapping and analyst recommendations.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-4">Risk</th>
              <th className="p-4">Source</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Signature</th>
              <th className="p-4">MITRE</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-t border-slate-800 hover:bg-slate-800/60"
              >
                <td className="p-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskBadgeColor(
                      alert.risk_level
                    )}`}
                  >
                    {alert.risk_level}
                  </span>
                </td>

                <td className="p-4 text-slate-300">{alert.src_ip}</td>
                <td className="p-4 text-slate-300">{alert.dest_ip}</td>
                <td className="p-4 font-medium text-white">{alert.signature}</td>

                <td className="p-4">
                  <div className="text-cyan-300">{alert.mitre_id}</div>
                  <div className="text-xs text-slate-500">{alert.mitre_tactic}</div>
                </td>

                <td className="p-4 text-slate-300">{alert.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-cyan-300">AI Analyst Recommendation</h2>
        <p className="mt-3 text-slate-300">
          Start with Critical alerts, validate MITRE mappings, and create incident cases for confirmed high-risk activity.
        </p>
      </div>
    </div>
  );
}