import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  DatabaseZap,
  FolderOpen,
  Target,
  FileText,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import api from "../services/api";

function QuickAction({ icon: Icon, title, description, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 text-left shadow-lg shadow-cyan-500/5 hover:border-cyan-400/40 hover:bg-cyan-500/5"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
        <Icon className="h-6 w-6 text-cyan-300" />
      </div>

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </motion.button>
  );
}

export default function Home({ setActivePage }) {
  const username = localStorage.getItem("cyberguard_user") || "Unknown";
  const role = localStorage.getItem("cyberguard_role") || "Unknown";

  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    api
      .get("/metrics")
      .then((response) => setMetrics(response.data))
      .catch((error) => console.error("Failed to load home metrics", error));
  }, []);

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 p-8 shadow-2xl shadow-cyan-500/10"
      >
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <Sparkles className="h-4 w-4" />
              CyberGuard SaaS Command Center
            </div>

            <h1 className="text-5xl font-bold text-white">
              Welcome back,{" "}
              <span className="text-cyan-300">
                {username}
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Monitor security posture, ingest realistic logs, triage incidents,
              review MITRE ATT&CK mappings, and generate executive-level SOC reports
              from one full-stack CyberGuard platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePage("Dashboard")}
                className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400"
              >
                Open Dashboard
              </button>

              <button
                onClick={() => setActivePage("Log Ingestion")}
                className="rounded-xl border border-cyan-500/30 px-5 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/10"
              >
                Ingest Logs
              </button>

              <button
                onClick={() => setActivePage("Demo Guide")}
                className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
              >
                Start Demo Guide
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/10 p-3">
                <UserRound className="h-7 w-7 text-cyan-300" />
              </div>

              <div>
                <p className="text-sm text-slate-400">Current Session</p>
                <p className="font-bold text-white">{role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  SOC Status
                </p>
                <p className="mt-2 text-xl font-bold text-green-300">
                  {metrics?.soc_status || "Loading..."}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Security Posture
                </p>
                <p className="mt-2 text-xl font-bold text-cyan-300">
                  {metrics?.security_posture || "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-red-500/20 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">Critical Alerts</p>
          <h2 className="mt-3 text-4xl font-bold text-red-400">
            {metrics?.critical_alerts ?? "—"}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-yellow-500/20 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">Open Incidents</p>
          <h2 className="mt-3 text-4xl font-bold text-yellow-400">
            {metrics?.open_incidents ?? "—"}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">Total Incidents</p>
          <h2 className="mt-3 text-4xl font-bold text-cyan-400">
            {metrics?.total_incidents ?? "—"}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-2xl border border-purple-500/20 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">Audit Events</p>
          <h2 className="mt-3 text-4xl font-bold text-purple-400">
            {metrics?.audit_events ?? "—"}
          </h2>
        </motion.div>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-cyan-300">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <QuickAction
            icon={LayoutDashboard}
            title="Review Dashboard"
            description="View live SOC metrics, charts, posture status, and analyst workload."
            onClick={() => setActivePage("Dashboard")}
            delay={0.05}
          />

          <QuickAction
            icon={DatabaseZap}
            title="Ingest Security Logs"
            description="Add realistic firewall, IDS, endpoint, and network log events."
            onClick={() => setActivePage("Log Ingestion")}
            delay={0.1}
          />

          <QuickAction
            icon={FolderOpen}
            title="Manage Incidents"
            description="Update incident status, add notes, and review SOC investigation details."
            onClick={() => setActivePage("Incidents")}
            delay={0.15}
          />

          <QuickAction
            icon={Target}
            title="Review MITRE Mapping"
            description="Analyze tactics, techniques, recommendations, and related incidents."
            onClick={() => setActivePage("MITRE Center")}
            delay={0.2}
          />

          <QuickAction
            icon={FileText}
            title="Generate Executive Report"
            description="Open the executive page and generate a SOC PDF report."
            onClick={() => setActivePage("Executive")}
            delay={0.25}
          />

          <QuickAction
            icon={ShieldCheck}
            title="Open Demo Guide"
            description="Follow the recommended walkthrough for presentation and viva demos."
            onClick={() => setActivePage("Demo Guide")}
            delay={0.3}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          CyberGuard AI Tip
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Use the floating CyberGuard AI assistant at the bottom-right to summarize risk,
          recommend investigation priorities, explain MITRE mapping, and guide the project demo.
        </p>
      </section>
    </div>
  );
}