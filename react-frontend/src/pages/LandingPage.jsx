import { motion } from "framer-motion";
import {
  Shield,
  Bot,
  DatabaseZap,
  FolderOpen,
  Target,
  FileText,
  Lock,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-6 shadow-lg shadow-cyan-500/5"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
        <Icon className="h-6 w-6 text-cyan-300" />
      </div>

      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}

export default function LandingPage({ onLaunchDemo }) {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <Shield className="h-8 w-8 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              CyberGuard
            </h1>
            <p className="text-xs text-slate-400">
              AI SOC SaaS Platform
            </p>
          </div>
        </div>

        <button
          onClick={onLaunchDemo}
          className="rounded-xl border border-cyan-500/30 px-5 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/10"
        >
          Launch Demo
        </button>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-10">
        <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Final-year ready cybersecurity SaaS
            </div>

            <h2 className="text-5xl font-black leading-tight text-white md:text-6xl">
              AI-powered SOC platform for{" "}
              <span className="text-cyan-300">
                real-world log triage
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CyberGuard helps analysts ingest security logs, create incidents,
              map threats to MITRE ATT&CK, use an AI SOC assistant, track audit
              activity, and generate executive PDF reports from one full-stack platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={onLaunchDemo}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/20 hover:bg-cyan-400"
              >
                Launch Interactive Demo
                <ArrowRight className="h-5 w-5" />
              </button>

              <a
                href="#features"
                className="rounded-xl border border-slate-600 px-6 py-4 text-sm font-bold text-slate-300 hover:bg-slate-900"
              >
                View Features
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-cyan-500/10 bg-slate-900 p-4">
                <p className="text-3xl font-bold text-cyan-300">4</p>
                <p className="mt-1 text-xs text-slate-400">Demo Roles</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/10 bg-slate-900 p-4">
                <p className="text-3xl font-bold text-cyan-300">AI</p>
                <p className="mt-1 text-xs text-slate-400">SOC Assistant</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/10 bg-slate-900 p-4">
                <p className="text-3xl font-bold text-cyan-300">PDF</p>
                <p className="mt-1 text-xs text-slate-400">Reports</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">SOC Posture</p>
                <h3 className="text-3xl font-bold text-cyan-300">
                  Operational
                </h3>
              </div>

              <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-bold text-green-300">
                Live Demo
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-xs text-slate-500">Critical Alerts</p>
                <p className="mt-2 text-4xl font-bold text-red-400">3</p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-xs text-slate-500">Open Incidents</p>
                <p className="mt-2 text-4xl font-bold text-yellow-400">7</p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-xs text-slate-500">MITRE Techniques</p>
                <p className="mt-2 text-4xl font-bold text-cyan-400">8</p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-5">
                <p className="text-xs text-slate-500">Audit Events</p>
                <p className="mt-2 text-4xl font-bold text-purple-400">24</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5">
              <div className="mb-3 flex items-center gap-2 text-cyan-300">
                <Bot className="h-5 w-5" />
                <p className="font-bold">CyberGuard AI</p>
              </div>

              <p className="text-sm leading-6 text-slate-300">
                “Prioritize critical brute-force and ransomware-like activity first,
                then review related logs and MITRE mappings before generating the executive report.”
              </p>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mt-20">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-white">
              Built like a real SOC SaaS product
            </h2>
            <p className="mt-3 text-slate-400">
              CyberGuard combines cybersecurity workflow, AI assistance, reporting, and SaaS architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              icon={DatabaseZap}
              title="Log Ingestion"
              description="Ingest realistic firewall, IDS, endpoint, Windows Event, and network security logs."
              delay={0.05}
            />

            <FeatureCard
              icon={FolderOpen}
              title="Incident Management"
              description="Create cases, update status, document analyst notes, and track investigation progress."
              delay={0.1}
            />

            <FeatureCard
              icon={Target}
              title="MITRE ATT&CK Mapping"
              description="Map threats to tactics and techniques with related incidents and recommended actions."
              delay={0.15}
            />

            <FeatureCard
              icon={Bot}
              title="AI SOC Assistant"
              description="Ask CyberGuard AI to summarize risk, prioritize incidents, explain MITRE, and guide demos."
              delay={0.2}
            />

            <FeatureCard
              icon={FileText}
              title="Executive Reports"
              description="Generate PDF reports for management with SOC posture, risks, and recommended actions."
              delay={0.25}
            />

            <FeatureCard
              icon={Lock}
              title="Role-Based Access"
              description="Administrator, SOC Analyst, SOC Manager, and Executive roles with protected endpoints."
              delay={0.3}
            />
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-cyan-300" />

          <h2 className="mt-4 text-4xl font-bold text-white">
            Ready to launch the demo?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-300">
            Explore the full CyberGuard platform with demo accounts, AI assistant,
            log ingestion, incident workflows, dashboard analytics, and executive reporting.
          </p>

          <button
            onClick={onLaunchDemo}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-4 text-sm font-bold text-slate-950 hover:bg-cyan-400"
          >
            Launch CyberGuard Demo
          </button>
        </section>
      </main>
    </div>
  );
}