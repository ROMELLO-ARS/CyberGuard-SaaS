import { useEffect, useState } from "react";
import api from "../services/api";

export default function Executive({ showToast }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/executive-summary")
      .then((response) => setSummary(response.data))
      .catch((error) => {
        console.error("Failed to load executive summary", error);
        showToast?.("Failed to load executive summary.", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  async function downloadExecutiveReport() {
    try {
      const response = await api.get("/executive-report/pdf", {
        responseType: "blob",
      });

      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = fileUrl;
      link.setAttribute("download", "cyberguard_executive_report.pdf");

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(fileUrl);

      showToast?.("Executive report downloaded successfully.", "success");
    } catch (error) {
      console.error("Failed to download executive report", error);
      showToast?.(
        "Failed to download executive report. Please check your role permissions.",
        "error"
      );
    }
  }

  if (loading) {
    return <p className="text-slate-300">Loading executive dashboard...</p>;
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
        <h1 className="text-2xl font-bold text-red-300">
          Executive Summary Unavailable
        </h1>
        <p className="mt-2 text-red-100/80">
          CyberGuard could not load the executive summary.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            📈 Executive Security Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            Management-level cybersecurity posture, operational risk, and recommended action summary.
          </p>
        </div>

        <button
          onClick={downloadExecutiveReport}
          className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
        >
          Generate Executive Report
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Security Posture Score</p>
          <h2 className="mt-3 text-5xl font-bold text-cyan-300">
            {summary.security_posture_score}
          </h2>
          <p className="mt-2 text-slate-400">out of 100</p>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <p className="text-sm text-yellow-200">Current Posture</p>
          <h2 className="mt-3 text-3xl font-bold text-yellow-300">
            {summary.security_posture}
          </h2>
          <p className="mt-2 text-sm text-yellow-100/70">
            Requires continued monitoring and analyst action.
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
          <p className="text-sm text-green-200">Reporting Status</p>
          <h2 className="mt-3 text-3xl font-bold text-green-300">
            Enabled
          </h2>
          <p className="mt-2 text-sm text-green-100/70">
            Executive summaries are available for decision support.
          </p>
        </div>
      </div>

      {summary.statistics && (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-red-500/20 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Critical Incidents</p>
            <h2 className="mt-3 text-4xl font-bold text-red-400">
              {summary.statistics.critical_incidents}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Open Incidents</p>
            <h2 className="mt-3 text-4xl font-bold text-yellow-400">
              {summary.statistics.open_incidents}
            </h2>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Resolved / Contained</p>
            <h2 className="mt-3 text-4xl font-bold text-green-400">
              {summary.statistics.resolved_incidents +
                summary.statistics.contained_incidents}
            </h2>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Audit Events</p>
            <h2 className="mt-3 text-4xl font-bold text-cyan-400">
              {summary.statistics.audit_events}
            </h2>
          </div>
        </div>
      )}

      <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          AI Executive Summary
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          {summary.summary}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-red-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-red-300">
            Top Security Risks
          </h2>

          <div className="mt-4 space-y-3">
            {summary.top_risks.map((risk, index) => (
              <div
                key={index}
                className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-slate-300"
              >
                {risk}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-cyan-300">
            Recommended Actions
          </h2>

          <div className="mt-4 space-y-3">
            {summary.recommended_actions.map((action, index) => (
              <div
                key={index}
                className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4 text-slate-300"
              >
                ✅ {action}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          SOC Maturity Indicators
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          {Object.entries(summary.maturity_indicators).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {key.replace("_", " ")}
              </p>
              <p className="mt-2 font-semibold text-green-300">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}