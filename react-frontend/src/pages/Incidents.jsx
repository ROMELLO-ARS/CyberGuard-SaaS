import { useEffect, useState } from "react";
import api from "../services/api";

function severityColor(severity) {
  if (severity === "Critical") return "text-red-300 bg-red-500/10 border-red-500/30";
  if (severity === "High") return "text-orange-300 bg-orange-500/10 border-orange-500/30";
  if (severity === "Medium") return "text-yellow-300 bg-yellow-500/10 border-yellow-500/30";
  return "text-slate-300 bg-slate-500/10 border-slate-500/30";
}

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/incidents")
      .then((response) => setIncidents(response.data))
      .catch((error) => console.error("Failed to load incidents", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-300">Loading incidents...</p>;
  }

  async function updateIncidentStatus(incidentId, newStatus) {
  try {
    await api.patch(`/incidents/${incidentId}/status`, {
      status: newStatus,
    });

    setIncidents((currentIncidents) =>
      currentIncidents.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: newStatus }
          : incident
      )
    );
  } catch (error) {
    console.error("Failed to update incident status", error);
    window.alert("Failed to update incident status.");
  }
}
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          📂 Incident Management
        </h1>
        <p className="mt-2 text-slate-400">
          Track active SOC cases, ownership, severity, and investigation status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {incident.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Source IP:{" "}
                  <span className="text-cyan-300">{incident.source_ip}</span>
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityColor(
                  incident.severity
                )}`}
              >
                {incident.severity}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-xs text-slate-500">Assigned To</p>
                <p className="font-semibold text-slate-200">
                  {incident.assigned_to}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
               <select
  value={incident.status}
  onChange={(event) =>
    updateIncidentStatus(incident.id, event.target.value)
  }
  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 font-semibold text-yellow-300 outline-none"
>
  <option value="Open">Open</option>
  <option value="Investigating">Investigating</option>
  <option value="Contained">Contained</option>
  <option value="Resolved">Resolved</option>
</select>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-xs text-slate-500">Created At</p>
                <p className="font-semibold text-slate-200">
                  {incident.created_at}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}