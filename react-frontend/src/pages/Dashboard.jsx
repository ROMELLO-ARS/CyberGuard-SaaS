import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import api from "../services/api";

const COLORS = ["#f87171", "#fb923c", "#facc15", "#38bdf8", "#22c55e", "#a78bfa"];

function MetricCard({ title, value, border, text, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-2xl border ${border} bg-slate-900 p-6 shadow-lg shadow-cyan-500/5`}
    >
      <p className="text-sm text-slate-400">{title}</p>
      <h2 className={`mt-3 text-4xl font-bold ${text}`}>
        {value}
      </h2>
    </motion.div>
  );
}

function ChartCard({ title, children, wide = false, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5 ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <h2 className="mb-6 text-2xl font-bold text-cyan-300">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-10 w-80 animate-pulse rounded-xl bg-slate-800"></div>
        <div className="mt-3 h-5 w-[520px] max-w-full animate-pulse rounded-lg bg-slate-800"></div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-cyan-500/10 bg-slate-900 p-6"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-slate-800"></div>
            <div className="mt-4 h-10 w-20 animate-pulse rounded bg-slate-800"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-80 rounded-2xl border border-cyan-500/10 bg-slate-900 p-6"
          >
            <div className="h-6 w-48 animate-pulse rounded bg-slate-800"></div>
            <div className="mt-8 h-56 animate-pulse rounded-xl bg-slate-800"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  async function loadDashboard() {
    try {
      setRefreshing(true);

      const metricsResponse = await api.get("/metrics");
      const analyticsResponse = await api.get("/dashboard-analytics");

      setMetrics(metricsResponse.data);
      setAnalytics(analyticsResponse.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!metrics || !analytics) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            Executive SOC Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            Live security metrics, incident trends, analyst workload, audit activity, and threat distribution from CyberGuard data.
          </p>

          {lastUpdated && (
            <p className="mt-2 text-xs text-slate-500">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        <button
          onClick={loadDashboard}
          disabled={refreshing}
          className="rounded-xl border border-cyan-500/30 px-5 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh Dashboard"}
        </button>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 to-slate-950 p-6 shadow-lg shadow-cyan-500/5"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-400">Current SOC Status</p>
            <h2 className="mt-2 text-3xl font-bold text-green-300">
              {metrics.soc_status}
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-400">Security Posture</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-300">
              {metrics.security_posture}
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-400">Operational Summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              CyberGuard is monitoring incidents, audit events, analyst notes, MITRE mappings, and ingested security logs for SOC triage.
            </p>
          </div>
        </div>
      </motion.section>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard
          title="Critical Alerts"
          value={metrics.critical_alerts}
          border="border-red-500/20"
          text="text-red-400"
          delay={0.05}
        />

        <MetricCard
          title="Open Incidents"
          value={metrics.open_incidents}
          border="border-yellow-500/20"
          text="text-yellow-400"
          delay={0.1}
        />

        <MetricCard
          title="Total Incidents"
          value={metrics.total_incidents}
          border="border-cyan-500/20"
          text="text-cyan-400"
          delay={0.15}
        />

        <MetricCard
          title="Audit Events"
          value={metrics.audit_events}
          border="border-purple-500/20"
          text="text-purple-400"
          delay={0.2}
        />

        <MetricCard
          title="Analyst Notes"
          value={metrics.total_notes}
          border="border-blue-500/20"
          text="text-blue-400"
          delay={0.25}
        />

        <MetricCard
          title="MITRE Techniques"
          value={metrics.mitre_techniques}
          border="border-cyan-500/20"
          text="text-cyan-400"
          delay={0.3}
        />

        <MetricCard
          title="Analyst XP"
          value={metrics.analyst_xp}
          border="border-emerald-500/20"
          text="text-emerald-400"
          delay={0.35}
        />

        <MetricCard
          title="Emergency Events"
          value={metrics.emergency_events}
          border="border-red-500/20"
          text="text-red-300"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Incident Trend" delay={0.1}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.incident_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="incidents" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Threat Distribution" delay={0.15}>
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
        </ChartCard>

        <ChartCard title="Status Distribution" delay={0.2}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.status_distribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {analytics.status_distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Analyst Workload" delay={0.25}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.analyst_workload}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="incidents" fill="#a78bfa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Audit Activity Trend" wide delay={0.3}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.audit_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35 }}
        className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6"
      >
        <h2 className="text-2xl font-bold text-cyan-300">
          AI Security Posture Summary
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          CyberGuard currently reports a{" "}
          <span className="font-bold text-cyan-300">
            {metrics.security_posture}
          </span>{" "}
          posture. The dashboard is using live backend incident, note, audit,
          MITRE, and log data to support SOC visibility and executive reporting.
        </p>
      </motion.section>
    </div>
  );
}