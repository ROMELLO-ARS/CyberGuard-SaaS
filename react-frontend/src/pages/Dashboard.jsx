import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/metrics")
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!metrics) {
    return (
      <div className="text-white">
        Loading CyberGuard Metrics...
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-cyan-400">
        Executive SOC Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-900 p-6">
          <h3 className="text-slate-400">
            Critical Alerts
          </h3>

          <h1 className="text-4xl font-bold text-red-400">
            {metrics.critical_alerts}
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <h3 className="text-slate-400">
            Open Incidents
          </h3>

          <h1 className="text-4xl font-bold text-yellow-400">
            {metrics.open_incidents}
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <h3 className="text-slate-400">
            Audit Events
          </h3>

          <h1 className="text-4xl font-bold text-cyan-400">
            {metrics.audit_events}
          </h1>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <h3 className="text-slate-400">
            Security Posture
          </h3>

          <h1 className="text-2xl font-bold text-green-400">
            {metrics.security_posture}
          </h1>
        </div>
      </div>
    </div>
  );
}