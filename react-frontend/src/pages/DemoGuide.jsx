export default function DemoGuide() {
  const demoSteps = [
    {
      title: "Login as Administrator",
      description:
        "Use admin / CyberGuard123 to access the full CyberGuard platform including incidents, MITRE, audit logs, executive reports, settings, and subscription pages.",
      outcome: "Demonstrates authentication and full administrator access.",
    },
    {
      title: "Review Dashboard Metrics",
      description:
        "Open the Dashboard to review live SOC metrics, incident trends, threat distribution, analyst workload, and operational status.",
      outcome: "Shows real-time security visibility from stored backend data.",
    },
    {
      title: "Create Incident from Threat Queue",
      description:
        "Go to Threat Queue and click Create Incident on a high-risk alert.",
      outcome: "Demonstrates alert triage and incident creation workflow.",
    },
    {
      title: "Update Incident Status",
      description:
        "Open Incidents and change a case status from Open to Investigating, Contained, or Resolved.",
      outcome: "Shows incident lifecycle management and audit tracking.",
    },
    {
      title: "Add Analyst Note",
      description:
        "Open View Details on an incident and add an investigation note.",
      outcome: "Demonstrates evidence documentation and SOC analyst accountability.",
    },
    {
      title: "View Audit Timeline",
      description:
        "Open Audit Timeline as Administrator to view recorded platform actions.",
      outcome: "Shows traceability, accountability, and governance controls.",
    },
    {
      title: "Review MITRE Mapping",
      description:
        "Open MITRE Center to view how incidents are mapped to ATT&CK techniques, tactics, recommendations, and related incidents.",
      outcome: "Shows cybersecurity intelligence and threat classification.",
    },
    {
      title: "Generate Executive Report",
      description:
        "Open Executive and click Generate Executive Report to download the PDF.",
      outcome: "Demonstrates executive-level reporting from live SOC data.",
    },
    {
      title: "Switch Roles to Test RBAC",
      description:
        "Log out and test analyst, manager, and executive accounts from the login screen.",
      outcome: "Shows role-based access control across frontend navigation and protected backend endpoints.",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          🎬 CyberGuard Demo Guide
        </h1>
        <p className="mt-2 text-slate-400">
          A guided walkthrough for presenting CyberGuard as a full-stack SOC SaaS platform.
        </p>
      </div>

      <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          Recommended Demo Flow
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Follow this sequence during your project demonstration to show authentication,
          role-based access control, incident response, MITRE ATT&CK mapping,
          audit logging, executive reporting, and SaaS readiness.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6">
        {demoSteps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-xl font-bold text-cyan-300">
                {index + 1}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {step.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-300">
                  {step.description}
                </p>

                <div className="mt-4 rounded-xl border border-green-500/10 bg-green-500/5 p-4">
                  <p className="text-sm font-semibold text-green-300">
                    Expected Outcome
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {step.outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          Demo Accounts
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">Administrator</p>
            <p className="mt-2 text-sm text-slate-400">admin</p>
            <p className="text-sm text-cyan-300">CyberGuard123</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">SOC Analyst</p>
            <p className="mt-2 text-sm text-slate-400">analyst</p>
            <p className="text-sm text-cyan-300">Analyst123</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">SOC Manager</p>
            <p className="mt-2 text-sm text-slate-400">manager</p>
            <p className="text-sm text-cyan-300">Manager123</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-4">
            <p className="font-semibold text-white">Executive</p>
            <p className="mt-2 text-sm text-slate-400">executive</p>
            <p className="text-sm text-cyan-300">Executive123</p>
          </div>
        </div>
      </section>
    </div>
  );
}