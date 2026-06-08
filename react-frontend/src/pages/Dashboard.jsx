import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#38bdf8"];

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const metricsResponse = await api.get("/metrics");
        const analyticsResponse = await api.get("/dashboard-analytics");

        setMetrics(metricsResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    }

    loadDashboard();
  }, []);

  if (!metrics || !analytics) {
    return <p className="text-slate-300">Loading CyberGuard dashboard...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          Executive SOC Dashboard
        </h1>
        <p className="mt-2 text-slate-400">
          Live security metrics, incident trends, and threat distribution from the CyberGuard API.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-red-500/20 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Critical Alerts</p>
          <h2 className="mt-3 text-4xl font-bold text-red-400">
            {metrics.critical_alerts}
          </h2>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Open Incidents</p>
          <h2 className="mt-3 text-4xl font-bold text-yellow-400">
            {metrics.open_incidents}
          </h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">MITRE Techniques</p>
          <h2 className="mt-3 text-4xl font-bold text-cyan-400">
            {metrics.mitre_techniques}
          </h2>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">SOC Status</p>
          <h2 className="mt-3 text-2xl font-bold text-green-400">
            {metrics.soc_status}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="mb-6 text-2xl font-bold text-cyan-300">
            Incident Trend
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.incident_trend}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="incidents" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="mb-6 text-2xl font-bold text-cyan-300">
            Threat Distribution
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.threat_distribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {analytics.threat_distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          AI Security Posture Summary
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          CyberGuard currently reports a {metrics.security_posture} posture. Critical alerts and open incidents should be reviewed first, with MITRE mappings used to support analyst investigation and executive reporting.
        </p>
      </section>
    </div>
  );
}